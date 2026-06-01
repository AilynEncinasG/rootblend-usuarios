import json
import os
import time
from datetime import datetime
from decimal import Decimal, InvalidOperation

import pika
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from apps.donations.models import (
    ChannelDonationRevenueStats,
    DonationRevenueEvent,
    ProcessedDonationEvent,
    StreamDonationRevenueStats,
)


def parse_datetime(value):
    if not value:
        return None

    if isinstance(value, datetime):
        return value

    try:
        clean_value = str(value).replace("Z", "+00:00")
        parsed = datetime.fromisoformat(clean_value)

        if timezone.is_naive(parsed):
            parsed = timezone.make_aware(parsed, timezone.get_current_timezone())

        return parsed
    except Exception:
        return None


def parse_decimal(value):
    try:
        return Decimal(str(value)).quantize(Decimal("0.01"))
    except (InvalidOperation, TypeError, ValueError):
        return Decimal("0.00")


def increment_by_type(stats, donation_type, amount):
    if donation_type == "flash":
        stats.flash_count += 1
        stats.flash_amount = (stats.flash_amount or Decimal("0.00")) + amount
        return

    if donation_type == "screen":
        stats.screen_count += 1
        stats.screen_amount = (stats.screen_amount or Decimal("0.00")) + amount
        return

    if donation_type == "epic":
        stats.epic_count += 1
        stats.epic_amount = (stats.epic_amount or Decimal("0.00")) + amount


def count_streams_with_donations(id_canal):
    return StreamDonationRevenueStats.objects.filter(
        id_canal=id_canal,
        total_donations__gt=0,
    ).count()


class Command(BaseCommand):
    help = "Consume eventos donation.paid desde RabbitMQ y actualiza estadisticas."

    def add_arguments(self, parser):
        parser.add_argument(
            "--queue",
            default=os.getenv("RABBITMQ_DONATION_STATS_QUEUE", "rootblend.stats.donations"),
        )

    def handle(self, *args, **options):
        queue_name = options["queue"]

        rabbitmq_host = os.getenv("RABBITMQ_HOST", "rabbitmq")
        rabbitmq_port = int(os.getenv("RABBITMQ_PORT", "5672"))
        rabbitmq_user = os.getenv("RABBITMQ_USER", "rootblend")
        rabbitmq_password = os.getenv("RABBITMQ_PASSWORD", "rootblend123")
        rabbitmq_vhost = os.getenv("RABBITMQ_VHOST", "/")
        rabbitmq_exchange = os.getenv("RABBITMQ_EXCHANGE", "rootblend.events")

        while True:
            connection = None

            try:
                credentials = pika.PlainCredentials(
                    rabbitmq_user,
                    rabbitmq_password,
                )

                parameters = pika.ConnectionParameters(
                    host=rabbitmq_host,
                    port=rabbitmq_port,
                    virtual_host=rabbitmq_vhost,
                    credentials=credentials,
                    heartbeat=30,
                    blocked_connection_timeout=10,
                    connection_attempts=3,
                    retry_delay=2,
                )

                connection = pika.BlockingConnection(parameters)
                channel = connection.channel()

                channel.exchange_declare(
                    exchange=rabbitmq_exchange,
                    exchange_type="topic",
                    durable=True,
                )

                channel.queue_declare(queue=queue_name, durable=True)

                channel.queue_bind(
                    exchange=rabbitmq_exchange,
                    queue=queue_name,
                    routing_key="donation.paid",
                )

                channel.basic_qos(prefetch_count=1)

                self.stdout.write(
                    self.style.SUCCESS(
                        f"ROOTBLEND_DONATION_STATS_CONSUMER_RUNNING queue={queue_name}"
                    )
                )

                def callback(ch, method, properties, body):
                    try:
                        payload = json.loads(body.decode("utf-8"))

                        event_id = payload.get("event_id")
                        routing_key = payload.get("routing_key") or method.routing_key
                        source = payload.get("source", "pagos-service")
                        occurred_at = parse_datetime(payload.get("occurred_at"))
                        data = payload.get("data") or {}

                        if not event_id:
                            self.stderr.write("DONATION_EVENT_WITHOUT_EVENT_ID")
                            ch.basic_ack(delivery_tag=method.delivery_tag)
                            return

                        if ProcessedDonationEvent.objects.filter(event_id=event_id).exists():
                            self.stdout.write(
                                f"DONATION_EVENT_DUPLICATE event_id={event_id}"
                            )
                            ch.basic_ack(delivery_tag=method.delivery_tag)
                            return

                        amount = parse_decimal(data.get("monto"))
                        id_stream = int(data.get("id_stream"))
                        id_canal = int(data.get("id_canal"))
                        donation_type = str(data.get("donation_type") or "unknown")

                        with transaction.atomic():
                            DonationRevenueEvent.objects.create(
                                event_id=event_id,
                                id_order=int(data.get("id_order") or 0),
                                id_donation=int(data.get("id_donation") or 0),
                                id_alert=(
                                    int(data.get("id_alert"))
                                    if data.get("id_alert") is not None
                                    else None
                                ),
                                id_stream=id_stream,
                                id_canal=id_canal,
                                id_usuario_viewer=(
                                    int(data.get("id_usuario_viewer"))
                                    if data.get("id_usuario_viewer") is not None
                                    else None
                                ),
                                nombre_viewer=data.get("nombre_viewer"),
                                donation_type=donation_type,
                                monto=amount,
                                moneda=data.get("moneda") or "BOB",
                                mensaje=data.get("mensaje"),
                                provider=data.get("provider") or "mock",
                                provider_reference=data.get("provider_reference"),
                                animation_key=data.get("animation_key"),
                                paid_at=parse_datetime(data.get("paid_at")),
                                occurred_at=occurred_at,
                            )

                            stream_stats, _ = StreamDonationRevenueStats.objects.get_or_create(
                                id_stream=id_stream,
                                defaults={
                                    "id_canal": id_canal,
                                },
                            )

                            stream_stats.id_canal = id_canal
                            stream_stats.total_donations += 1
                            stream_stats.total_amount = (
                                stream_stats.total_amount or Decimal("0.00")
                            ) + amount

                            increment_by_type(stream_stats, donation_type, amount)

                            if amount >= (stream_stats.highest_donation_amount or Decimal("0.00")):
                                stream_stats.highest_donation_amount = amount
                                stream_stats.highest_donor_name = data.get("nombre_viewer")

                            stream_stats.last_donation_amount = amount
                            stream_stats.last_donor_name = data.get("nombre_viewer")
                            stream_stats.last_donation_type = donation_type
                            stream_stats.last_donation_at = parse_datetime(
                                data.get("paid_at")
                            ) or timezone.now()

                            stream_stats.save()

                            channel_stats, _ = ChannelDonationRevenueStats.objects.get_or_create(
                                id_canal=id_canal
                            )

                            channel_stats.total_donations += 1
                            channel_stats.total_amount = (
                                channel_stats.total_amount or Decimal("0.00")
                            ) + amount

                            channel_stats.total_streams_with_donations = (
                                count_streams_with_donations(id_canal)
                            )

                            if amount >= (
                                channel_stats.highest_donation_amount or Decimal("0.00")
                            ):
                                channel_stats.highest_donation_amount = amount
                                channel_stats.highest_donor_name = data.get("nombre_viewer")

                            channel_stats.last_donation_amount = amount
                            channel_stats.last_donor_name = data.get("nombre_viewer")
                            channel_stats.last_donation_type = donation_type
                            channel_stats.last_donation_at = parse_datetime(
                                data.get("paid_at")
                            ) or timezone.now()

                            channel_stats.save()

                            ProcessedDonationEvent.objects.create(
                                event_id=event_id,
                                routing_key=routing_key,
                                source=source,
                            )

                        self.stdout.write(
                            self.style.SUCCESS(
                                f"DONATION_EVENT_PROCESSED event_id={event_id} stream={id_stream} amount={amount}"
                            )
                        )

                        ch.basic_ack(delivery_tag=method.delivery_tag)

                    except Exception as error:
                        self.stderr.write(f"DONATION_EVENT_PROCESS_ERROR error={error}")
                        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)

                channel.basic_consume(
                    queue=queue_name,
                    on_message_callback=callback,
                    auto_ack=False,
                )

                channel.start_consuming()

            except KeyboardInterrupt:
                self.stdout.write("ROOTBLEND_DONATION_STATS_CONSUMER_STOPPED")
                break

            except Exception as error:
                self.stderr.write(
                    f"ROOTBLEND_DONATION_STATS_CONSUMER_RETRY error={error}"
                )
                time.sleep(5)

            finally:
                if connection and connection.is_open:
                    connection.close()