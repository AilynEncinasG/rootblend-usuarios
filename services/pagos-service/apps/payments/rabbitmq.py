import json
import logging
from datetime import datetime
from decimal import Decimal
from uuid import uuid4

import pika
from django.conf import settings


logger = logging.getLogger(__name__)


class RootblendJsonEncoder(json.JSONEncoder):
    def default(self, value):
        if isinstance(value, Decimal):
            return float(value)

        if isinstance(value, datetime):
            return value.isoformat()

        return super().default(value)


def publish_event(routing_key, payload):
    if not getattr(settings, "RABBITMQ_ENABLED", True):
        logger.info("RABBITMQ_DISABLED routing_key=%s", routing_key)
        return False

    event_payload = {
        "event_id": str(uuid4()),
        "routing_key": routing_key,
        "source": "pagos-service",
        "occurred_at": datetime.utcnow().isoformat() + "Z",
        "data": payload,
    }

    credentials = pika.PlainCredentials(
        settings.RABBITMQ_USER,
        settings.RABBITMQ_PASSWORD,
    )

    parameters = pika.ConnectionParameters(
        host=settings.RABBITMQ_HOST,
        port=settings.RABBITMQ_PORT,
        virtual_host=settings.RABBITMQ_VHOST,
        credentials=credentials,
        heartbeat=30,
        blocked_connection_timeout=10,
        connection_attempts=3,
        retry_delay=2,
    )

    connection = None

    try:
        connection = pika.BlockingConnection(parameters)
        channel = connection.channel()

        channel.exchange_declare(
            exchange=settings.RABBITMQ_EXCHANGE,
            exchange_type="topic",
            durable=True,
        )

        channel.basic_publish(
            exchange=settings.RABBITMQ_EXCHANGE,
            routing_key=routing_key,
            body=json.dumps(event_payload, cls=RootblendJsonEncoder).encode("utf-8"),
            properties=pika.BasicProperties(
                content_type="application/json",
                delivery_mode=2,
            ),
        )

        logger.info("RABBITMQ_EVENT_PUBLISHED routing_key=%s", routing_key)
        return True

    except Exception as error:
        logger.exception(
            "RABBITMQ_EVENT_PUBLISH_ERROR routing_key=%s error=%s",
            routing_key,
            error,
        )
        return False

    finally:
        if connection and connection.is_open:
            connection.close()