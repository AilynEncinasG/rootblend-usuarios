import json
from datetime import time

from django.db import transaction
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .models import EstadisticaStream, MetricaAudiencia, MetricaChat


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

    hours = min(total_seconds // 3600, 838)
    minutes = (total_seconds % 3600) // 60
    seconds = total_seconds % 60
    return time(hour=hours % 24, minute=minutes, second=seconds)


def time_to_seconds(value):
    if not value:
        return 0

    return value.hour * 3600 + value.minute * 60 + value.second


def get_or_create_stream_stats(id_stream):
    stats = (
        EstadisticaStream.objects.filter(id_stream=id_stream)
        .order_by("-id_estadistica_stream")
        .first()
    )

    if stats:
        return stats

    return EstadisticaStream.objects.create(id_stream=id_stream)


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


@require_http_methods(["GET"])
def stream_stats(request, id_stream):
    stats = get_or_create_stream_stats(id_stream)
    return ok(serialize_stream_stats(stats))


@csrf_exempt
@require_http_methods(["POST"])
def stream_event(request):
    body = parse_json_body(request)

    if body is None:
        return error("JSON invalido.", 400)

    try:
        id_stream = int(body.get("id_stream"))
    except (TypeError, ValueError):
        return error("Debes enviar id_stream valido.", 400)

    event_type = body.get("event_type") or body.get("tipo_evento") or ""
    espectadores_actuales = int(body.get("espectadores_actuales") or 0)

    with transaction.atomic():
        stats = get_or_create_stream_stats(id_stream)

        if event_type == "stream.started":
            MetricaAudiencia.objects.create(
                estadistica_stream=stats,
                espectadores_actuales=espectadores_actuales,
                espectadores_unicos=stats.total_vistas,
                origen_trafico="inicio_stream",
            )

        elif event_type == "stream.ended":
            duracion = seconds_to_time(body.get("duracion_segundos"))

            if duracion:
                stats.duracion_total = duracion
                stats.save(update_fields=["duracion_total"])

            MetricaAudiencia.objects.create(
                estadistica_stream=stats,
                espectadores_actuales=0,
                espectadores_unicos=stats.total_vistas,
                origen_trafico="fin_stream",
            )

        elif event_type == "viewer.joined":
            stats.total_vistas = (stats.total_vistas or 0) + 1
            stats.espectadores_pico = max(stats.espectadores_pico or 0, espectadores_actuales)
            stats.save(update_fields=["total_vistas", "espectadores_pico"])

            MetricaAudiencia.objects.create(
                estadistica_stream=stats,
                espectadores_actuales=espectadores_actuales,
                espectadores_unicos=stats.total_vistas,
                origen_trafico=body.get("origen_trafico") or "web",
            )

        elif event_type == "viewer.left":
            MetricaAudiencia.objects.create(
                estadistica_stream=stats,
                espectadores_actuales=espectadores_actuales,
                espectadores_unicos=stats.total_vistas,
                origen_trafico=body.get("origen_trafico") or "web",
            )

        elif event_type == "chat.message":
            latest = stats.metricas_chat.order_by("-id_metrica_chat").first()
            MetricaChat.objects.create(
                estadistica_stream=stats,
                total_mensajes=(latest.total_mensajes if latest else 0) + 1,
                mensajes_eliminados=latest.mensajes_eliminados if latest else 0,
                usuarios_activos=max((latest.usuarios_activos if latest else 0), int(body.get("usuarios_activos") or 1)),
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
            return error("Tipo de evento no soportado.", 400)

    return ok(serialize_stream_stats(stats), "Evento de estadistica procesado.", 201)
