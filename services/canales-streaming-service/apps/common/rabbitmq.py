import json
import uuid
from datetime import datetime, timezone

import pika
from django.conf import settings


def build_event(event_type, data, source_service="canales-streaming-service"):
    return {
        "event_id": str(uuid.uuid4()),
        "event_type": event_type,
        "source_service": source_service,
        "occurred_at": datetime.now(timezone.utc).isoformat(),
        "data": data,
    }


def _credentials():
    return pika.PlainCredentials(settings.RABBITMQ_USER, settings.RABBITMQ_PASSWORD)


def _connection_parameters():
    return pika.ConnectionParameters(
        host=settings.RABBITMQ_HOST,
        port=settings.RABBITMQ_PORT,
        virtual_host=settings.RABBITMQ_VHOST,
        credentials=_credentials(),
        heartbeat=30,
        blocked_connection_timeout=5,
        connection_attempts=2,
        retry_delay=1,
    )


def publish_event(event_type, data, routing_key=None):
    """
    Publica eventos de negocio en RabbitMQ sin romper el flujo principal.
    """
    if not getattr(settings, "RABBITMQ_ENABLED", True):
        return False

    envelope = build_event(event_type, data)
    routing_key = routing_key or event_type

    try:
        connection = pika.BlockingConnection(_connection_parameters())
        channel = connection.channel()
        channel.exchange_declare(
            exchange=settings.RABBITMQ_EXCHANGE,
            exchange_type="topic",
            durable=True,
        )
        channel.basic_publish(
            exchange=settings.RABBITMQ_EXCHANGE,
            routing_key=routing_key,
            body=json.dumps(envelope, ensure_ascii=False).encode("utf-8"),
            properties=pika.BasicProperties(
                content_type="application/json",
                delivery_mode=2,
                message_id=envelope["event_id"],
                type=event_type,
            ),
        )
        connection.close()
        print(
            "ROOTBLEND_RABBITMQ_PUBLISHED "
            f"event_type={event_type} routing_key={routing_key} event_id={envelope['event_id']}"
        )
        return True
    except Exception as exc:
        print(f"ROOTBLEND_RABBITMQ_PUBLISH_ERROR event_type={event_type}: {exc}")
        return False
