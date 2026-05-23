import json
import time

import pika
from django.conf import settings
from django.core.management.base import BaseCommand

from core.views import process_rabbitmq_envelope


class Command(BaseCommand):
    help = "Consume eventos ROOTBLEND desde RabbitMQ para estadisticas-service."

    def add_arguments(self, parser):
        parser.add_argument(
            "--once",
            action="store_true",
            help="Consume mensajes disponibles y termina. Util para demo/debug.",
        )

    def connection_parameters(self):
        credentials = pika.PlainCredentials(settings.RABBITMQ_USER, settings.RABBITMQ_PASSWORD)
        return pika.ConnectionParameters(
            host=settings.RABBITMQ_HOST,
            port=settings.RABBITMQ_PORT,
            virtual_host=settings.RABBITMQ_VHOST,
            credentials=credentials,
            heartbeat=30,
            blocked_connection_timeout=10,
            connection_attempts=5,
            retry_delay=3,
        )

    def declare_topology(self, channel):
        channel.exchange_declare(
            exchange=settings.RABBITMQ_EXCHANGE,
            exchange_type="topic",
            durable=True,
        )

        channel.queue_declare(
            queue=settings.RABBITMQ_STATS_STREAM_QUEUE,
            durable=True,
            arguments={"x-dead-letter-exchange": "rootblend.events.dlx"},
        )
        channel.queue_declare(
            queue=settings.RABBITMQ_STATS_PODCAST_QUEUE,
            durable=True,
            arguments={"x-dead-letter-exchange": "rootblend.events.dlx"},
        )

        for routing_key in ["stream.*", "viewer.*", "chat.message.*"]:
            channel.queue_bind(
                queue=settings.RABBITMQ_STATS_STREAM_QUEUE,
                exchange=settings.RABBITMQ_EXCHANGE,
                routing_key=routing_key,
            )

        channel.queue_bind(
            queue=settings.RABBITMQ_STATS_PODCAST_QUEUE,
            exchange=settings.RABBITMQ_EXCHANGE,
            routing_key="episode.played",
        )

    def callback(self, channel, method, properties, body):
        try:
            envelope = json.loads(body.decode("utf-8"))
            result = process_rabbitmq_envelope(envelope)
            self.stdout.write(
                self.style.SUCCESS(
                    "ROOTBLEND_STATS_EVENT_OK "
                    f"routing_key={method.routing_key} "
                    f"event_id={envelope.get('event_id')} "
                    f"event_type={envelope.get('event_type')} "
                    f"status={result.get('status')}"
                )
            )
            channel.basic_ack(delivery_tag=method.delivery_tag)
        except Exception as exc:
            self.stderr.write(
                self.style.ERROR(
                    "ROOTBLEND_STATS_EVENT_ERROR "
                    f"routing_key={getattr(method, 'routing_key', '')} error={exc}"
                )
            )
            channel.basic_nack(delivery_tag=method.delivery_tag, requeue=False)

    def handle_once(self, channel):
        processed = 0
        for queue in [settings.RABBITMQ_STATS_STREAM_QUEUE, settings.RABBITMQ_STATS_PODCAST_QUEUE]:
            while True:
                method, properties, body = channel.basic_get(queue=queue, auto_ack=False)
                if not method:
                    break
                self.callback(channel, method, properties, body)
                processed += 1
        self.stdout.write(self.style.SUCCESS(f"ROOTBLEND_STATS_CONSUME_ONCE processed={processed}"))

    def handle(self, *args, **options):
        if not settings.RABBITMQ_ENABLED:
            self.stdout.write(self.style.WARNING("RabbitMQ desactivado para estadisticas-service."))
            return

        while True:
            try:
                connection = pika.BlockingConnection(self.connection_parameters())
                channel = connection.channel()
                self.declare_topology(channel)
                channel.basic_qos(prefetch_count=10)

                if options.get("once"):
                    self.handle_once(channel)
                    connection.close()
                    return

                channel.basic_consume(
                    queue=settings.RABBITMQ_STATS_STREAM_QUEUE,
                    on_message_callback=self.callback,
                    auto_ack=False,
                )
                channel.basic_consume(
                    queue=settings.RABBITMQ_STATS_PODCAST_QUEUE,
                    on_message_callback=self.callback,
                    auto_ack=False,
                )

                self.stdout.write(self.style.SUCCESS("ROOTBLEND_STATS_CONSUMER_RUNNING"))
                channel.start_consuming()
            except KeyboardInterrupt:
                self.stdout.write(self.style.WARNING("Consumidor de estadisticas detenido."))
                return
            except Exception as exc:
                self.stderr.write(self.style.ERROR(f"ROOTBLEND_STATS_CONSUMER_RETRY error={exc}"))
                time.sleep(5)
