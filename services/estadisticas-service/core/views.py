import json
from datetime import time

from django.db import IntegrityError, transaction
from django.db.models import Count, Max
from django.http import JsonResponse
from django.utils.dateparse import parse_time
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .models import (
    EstadisticaPodcast,
    EstadisticaStream,
    MetricaAudiencia,
    MetricaChat,
    ProcessedEvent,
    ReproduccionPodcast,
)


def health_view(request):
    return JsonResponse(
        {
            "status": "ok",
            "service": "estadisticas-service",
        },
        status=200,
    )


def ok(data=None, message="OK", status=200):
    return JsonResponse(
        {
            "success": True,
            "message": message,
            "data": data or {},
        },
        status=status,
    )


def error(message, status=400):
    return JsonResponse(
        {
            "success": False,
            "message": message,
        },
        status=status,
    )


def parse_json_body(request):
    try:
        return json.loads(request.body.decode("utf-8") or "{}")
    except json.JSONDecodeError:
        return None


def seconds_to_time(total_seconds):
    if total_seconds is None:
        return None

    try:
        total_seconds = max(int(total_seconds), 0)
    except (TypeError, ValueError):
        return None

    hours = min(total_seconds // 3600, 23)
    minutes = (total_seconds % 3600) // 60
    seconds = total_seconds % 60
    return time(hour=hours, minute=minutes, second=seconds)


def time_to_seconds(value):
    if not value:
        return 0

    return value.hour * 3600 + value.minute * 60 + value.second


def parse_hms(value):
    if not value:
        return None

    if isinstance(value, time):
        return value

    return parse_time(str(value))


def truthy(value):
    if isinstance(value, bool):
        return value

    if isinstance(value, str):
        return value.strip().lower() in {"1", "true", "yes", "si", "on"}

    return bool(value)


def get_or_create_stream_stats(id_stream):
    stats = (
        EstadisticaStream.objects.filter(id_stream=id_stream)
        .order_by("-id_estadistica_stream")
        .first()
    )

    if stats:
        return stats

    return EstadisticaStream.objects.create(id_stream=id_stream)


def get_or_create_podcast_stats(id_podcast):
    stats = (
        EstadisticaPodcast.objects.filter(id_podcast=id_podcast)
        .order_by("-id_estadistica_podcast")
        .first()
    )

    if stats:
        return stats

    return EstadisticaPodcast.objects.create(id_podcast=id_podcast)


def serialize_stream_stats(stats):
    latest_audience = stats.metricas_audiencia.order_by("-id_metrica_audiencia").first()
    latest_chat = stats.metricas_chat.order_by("-id_metrica_chat").first()

    return {
        "id_estadistica_stream": stats.id_estadistica_stream,
        "id_stream": stats.id_stream,
        "total_vistas": stats.total_vistas,
        "espectadores_pico": stats.espectadores_pico,
        "duracion_total": str(stats.duracion_total) if stats.duracion_total else None,
        "duracion_segundos": time_to_seconds(stats.duracion_total),
        "fecha_generacion": stats.fecha_generacion.isoformat() if stats.fecha_generacion else None,
        "audiencia": {
            "espectadores_actuales": latest_audience.espectadores_actuales if latest_audience else 0,
            "espectadores_unicos": latest_audience.espectadores_unicos if latest_audience else stats.total_vistas,
            "fecha_registro": latest_audience.fecha_registro.isoformat() if latest_audience else None,
            "origen_trafico": latest_audience.origen_trafico if latest_audience else None,
        },
        "chat": {
            "total_mensajes": latest_chat.total_mensajes if latest_chat else 0,
            "mensajes_eliminados": latest_chat.mensajes_eliminados if latest_chat else 0,
            "usuarios_activos": latest_chat.usuarios_activos if latest_chat else 0,
            "fecha_registro": latest_chat.fecha_registro.isoformat() if latest_chat else None,
        },
    }


def podcast_episode_rows(stats):
    return list(
        ReproduccionPodcast.objects.filter(estadistica_podcast=stats)
        .values("id_episodio")
        .annotate(
            reproducciones=Count("id_reproduccion"),
            ultima_reproduccion=Max("fecha_reproduccion"),
        )
        .order_by("-reproducciones", "id_episodio")
    )


def serialize_podcast_stats(stats):
    return {
        "id_estadistica_podcast": stats.id_estadistica_podcast,
        "id_podcast": stats.id_podcast,
        "total_reproducciones": stats.total_reproducciones,
        "episodios_publicados": stats.episodios_publicados,
        "duracion_acumulada": str(stats.duracion_acumulada) if stats.duracion_acumulada else None,
        "duracion_acumulada_segundos": time_to_seconds(stats.duracion_acumulada),
        "fecha_generacion": stats.fecha_generacion.isoformat() if stats.fecha_generacion else None,
        "plays_by_episode": podcast_episode_rows(stats),
    }


def serialize_episode_stats(id_episodio):
    plays = ReproduccionPodcast.objects.filter(id_episodio=id_episodio)
    latest = plays.order_by("-fecha_reproduccion").first()

    return {
        "id_episodio": id_episodio,
        "total_reproducciones": plays.count(),
        "reproducciones_completadas": plays.filter(completado=True).count(),
        "ultima_reproduccion": latest.fecha_reproduccion.isoformat() if latest else None,
        "dispositivos": list(
            plays.values("dispositivo")
            .annotate(total=Count("id_reproduccion"))
            .order_by("-total", "dispositivo")
        ),
    }


def process_stream_event_payload(payload):
    try:
        id_stream = int(payload.get("id_stream"))
    except (TypeError, ValueError):
        raise ValueError("Debes enviar id_stream valido.")

    event_type = payload.get("event_type") or payload.get("tipo_evento") or ""
    espectadores_actuales = int(
        payload.get("espectadores_actuales")
        or payload.get("viewer_count")
        or 0
    )

    with transaction.atomic():
        stats = get_or_create_stream_stats(id_stream)

        if event_type == "stream.started":
            MetricaAudiencia.objects.create(
                estadistica_stream=stats,
                espectadores_actuales=espectadores_actuales,
                espectadores_unicos=stats.total_vistas,
                origen_trafico="rabbitmq_stream_started",
            )

        elif event_type == "stream.ended":
            duracion = seconds_to_time(payload.get("duracion_segundos"))

            if duracion:
                stats.duracion_total = duracion
                stats.save(update_fields=["duracion_total"])

            MetricaAudiencia.objects.create(
                estadistica_stream=stats,
                espectadores_actuales=0,
                espectadores_unicos=stats.total_vistas,
                origen_trafico="rabbitmq_stream_ended",
            )

        elif event_type == "viewer.joined":
            stats.total_vistas = (stats.total_vistas or 0) + 1
            stats.espectadores_pico = max(stats.espectadores_pico or 0, espectadores_actuales)
            stats.save(update_fields=["total_vistas", "espectadores_pico"])

            MetricaAudiencia.objects.create(
                estadistica_stream=stats,
                espectadores_actuales=espectadores_actuales,
                espectadores_unicos=stats.total_vistas,
                origen_trafico=payload.get("origen_trafico") or "rabbitmq_viewer_joined",
            )

        elif event_type == "viewer.left":
            MetricaAudiencia.objects.create(
                estadistica_stream=stats,
                espectadores_actuales=espectadores_actuales,
                espectadores_unicos=stats.total_vistas,
                origen_trafico=payload.get("origen_trafico") or "rabbitmq_viewer_left",
            )

        elif event_type == "chat.message":
            latest = stats.metricas_chat.order_by("-id_metrica_chat").first()
            MetricaChat.objects.create(
                estadistica_stream=stats,
                total_mensajes=(latest.total_mensajes if latest else 0) + 1,
                mensajes_eliminados=latest.mensajes_eliminados if latest else 0,
                usuarios_activos=max((latest.usuarios_activos if latest else 0), int(payload.get("usuarios_activos") or 1)),
            )

        elif event_type == "chat.message.deleted":
            latest = stats.metricas_chat.order_by("-id_metrica_chat").first()
            MetricaChat.objects.create(
                estadistica_stream=stats,
                total_mensajes=latest.total_mensajes if latest else 0,
                mensajes_eliminados=(latest.mensajes_eliminados if latest else 0) + 1,
                usuarios_activos=latest.usuarios_activos if latest else 0,
            )

        else:
            raise ValueError("Tipo de evento no soportado.")

    return stats


def process_podcast_event_payload(payload):
    event_type = payload.get("event_type") or ""

    if event_type != "episode.played":
        raise ValueError("Tipo de evento de podcast no soportado.")

    try:
        id_podcast = int(payload.get("id_podcast"))
        id_episodio = int(payload.get("id_episodio"))
    except (TypeError, ValueError):
        raise ValueError("Debes enviar id_podcast e id_episodio validos.")

    with transaction.atomic():
        stats = get_or_create_podcast_stats(id_podcast)
        tiempo_escuchado = parse_hms(payload.get("tiempo_escuchado"))
        total_seconds = time_to_seconds(stats.duracion_acumulada) + time_to_seconds(tiempo_escuchado)

        stats.total_reproducciones = (stats.total_reproducciones or 0) + 1
        stats.episodios_publicados = max(
            stats.episodios_publicados or 0,
            int(payload.get("episodios_publicados") or 0),
        )
        stats.duracion_acumulada = seconds_to_time(total_seconds)
        stats.save(update_fields=["total_reproducciones", "episodios_publicados", "duracion_acumulada"])

        ReproduccionPodcast.objects.create(
            estadistica_podcast=stats,
            id_episodio=id_episodio,
            tiempo_escuchado=tiempo_escuchado,
            completado=truthy(payload.get("completado", False)),
            dispositivo=(payload.get("dispositivo") or "web")[:100],
        )

    return stats


def mark_event_processed(event_id, event_type, source_service=None):
    if not event_id:
        return True

    try:
        ProcessedEvent.objects.create(
            event_id=event_id,
            event_type=event_type,
            source_service=source_service,
        )
        return True
    except IntegrityError:
        return False


def process_rabbitmq_envelope(envelope):
    event_id = envelope.get("event_id")
    event_type = envelope.get("event_type") or ""
    source_service = envelope.get("source_service")
    data = envelope.get("data") or {}

    if event_id and ProcessedEvent.objects.filter(event_id=event_id).exists():
        return {"status": "duplicate", "event_id": event_id, "event_type": event_type}

    if not isinstance(data, dict):
        raise ValueError("El campo data del evento debe ser un objeto.")

    payload = {"event_type": event_type, **data}

    if event_type in {"stream.started", "stream.ended", "viewer.joined", "viewer.left", "chat.message", "chat.message.deleted"}:
        stats = process_stream_event_payload(payload)
        mark_event_processed(event_id, event_type, source_service)
        return {"status": "processed", "type": "stream", "stats": serialize_stream_stats(stats)}

    if event_type == "episode.played":
        stats = process_podcast_event_payload(payload)
        mark_event_processed(event_id, event_type, source_service)
        return {"status": "processed", "type": "podcast", "stats": serialize_podcast_stats(stats)}

    raise ValueError("Tipo de evento no soportado.")


@require_http_methods(["GET"])
def stream_stats(request, id_stream):
    stats = get_or_create_stream_stats(id_stream)
    return ok(serialize_stream_stats(stats))


@require_http_methods(["GET"])
def podcast_stats(request, id_podcast):
    stats = get_or_create_podcast_stats(id_podcast)
    return ok(serialize_podcast_stats(stats))


@require_http_methods(["GET"])
def podcast_episodes_stats(request, id_podcast):
    stats = get_or_create_podcast_stats(id_podcast)
    return ok({"id_podcast": id_podcast, "episodes": podcast_episode_rows(stats)})


@require_http_methods(["GET"])
def episode_stats(request, id_episodio):
    return ok(serialize_episode_stats(id_episodio))


@csrf_exempt
@require_http_methods(["POST"])
def stream_event(request):
    body = parse_json_body(request)

    if body is None:
        return error("JSON invalido.", 400)

    try:
        stats = process_stream_event_payload(body)
    except ValueError as exc:
        return error(str(exc), 400)

    return ok(serialize_stream_stats(stats), "Evento de estadistica procesado.", 201)


@csrf_exempt
@require_http_methods(["POST"])
def podcast_event(request):
    body = parse_json_body(request)

    if body is None:
        return error("JSON invalido.", 400)

    try:
        stats = process_podcast_event_payload(body)
    except ValueError as exc:
        return error(str(exc), 400)

    return ok(serialize_podcast_stats(stats), "Evento de podcast procesado.", 201)
