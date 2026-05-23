import json
import urllib.error
import urllib.request
import uuid
from datetime import timedelta
from django.conf import settings
from django.db import transaction
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from apps.canales.models import Canal, TipoCanal
from apps.common.auth import get_current_user_id
from apps.common.rabbitmq import publish_event
from apps.common.responses import error_response, success_response
from apps.categorias.models import Categoria
from .models import ConfiguracionStream, Stream, StreamViewerSession

SIGNAL_TIMEOUT_SECONDS = 20

VIEWER_TIMEOUT_SECONDS = 30


def get_client_ip(request):
    forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")

    if forwarded_for:
        return forwarded_for.split(",")[0].strip()

    return request.META.get("REMOTE_ADDR")


def get_viewer_key(request, body):
    viewer_key = (body.get("viewer_key") or "").strip()

    if viewer_key:
        return viewer_key

    return uuid.uuid4().hex


def expire_old_viewers(stream):
    timeout_at = timezone.now() - timedelta(seconds=VIEWER_TIMEOUT_SECONDS)

    StreamViewerSession.objects.filter(
        stream=stream,
        active=True,
        last_seen_at__lt=timeout_at,
    ).update(active=False)

    active_count = StreamViewerSession.objects.filter(
        stream=stream,
        active=True,
    ).count()

    stream.viewer_count = active_count
    stream.save(update_fields=["viewer_count"])

    return active_count

def post_internal_event(base_url, path, payload):
    """
    Envia eventos internos a otros microservicios sin bloquear el flujo principal.
    Si interacciones-service o estadisticas-service estan caidos, el stream sigue funcionando.
    """
    if not base_url:
        return

    url = f"{base_url.rstrip('/')}/{path.lstrip('/')}"

    try:
        body = json.dumps(payload).encode("utf-8")
        request = urllib.request.Request(
            url,
            data=body,
            headers={
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            method="POST",
        )

        with urllib.request.urlopen(request, timeout=2):
            return
    except Exception as exc:
        print(f"ROOTBLEND_INTERNAL_EVENT_ERROR {url}: {exc}")


def dispatch_event(event_type, payload, http_fallbacks=None):
    """
    Publica el evento por RabbitMQ.

    Si INTERNAL_HTTP_EVENTS_FALLBACK=true, conserva el envio HTTP viejo como respaldo.
    En modo defensa debe quedar en false para demostrar que RabbitMQ es el bus real.
    """
    published = publish_event(event_type, payload, routing_key=event_type)

    if published or not getattr(settings, "INTERNAL_HTTP_EVENTS_FALLBACK", False):
        return

    for base_url, path in http_fallbacks or []:
        post_internal_event(base_url, path, {"event_type": event_type, **payload})


def publish_stream_started(stream):
    payload = {
        "id_stream": stream.id,
        "id_canal": stream.canal.id,
        "nombre_canal": stream.canal.nombre_canal,
        "tipo_canal": stream.canal.tipo_canal.nombre_tipo,
        "titulo": stream.titulo,
        "descripcion": stream.descripcion,
        "categoria": stream.categoria.nombre if stream.categoria else None,
        "fecha_inicio": stream.fecha_inicio.isoformat() if stream.fecha_inicio else None,
        "espectadores_actuales": stream.viewer_count or 0,
    }

    dispatch_event(
        "stream.started",
        payload,
        http_fallbacks=[
            (getattr(settings, "INTERACCIONES_SERVICE_URL", None), "/events/stream-started"),
            (getattr(settings, "ESTADISTICAS_SERVICE_URL", None), "/events/stream/"),
        ],
    )


def publish_stream_ended(stream):
    duration_seconds = None

    if stream.fecha_inicio and stream.fecha_fin:
        duration_seconds = int((stream.fecha_fin - stream.fecha_inicio).total_seconds())

    payload = {
        "id_stream": stream.id,
        "id_canal": stream.canal.id,
        "nombre_canal": stream.canal.nombre_canal,
        "titulo": stream.titulo,
        "fecha_inicio": stream.fecha_inicio.isoformat() if stream.fecha_inicio else None,
        "fecha_fin": stream.fecha_fin.isoformat() if stream.fecha_fin else None,
        "duracion_segundos": duration_seconds,
        "espectadores_actuales": stream.viewer_count or 0,
    }

    dispatch_event(
        "stream.ended",
        payload,
        http_fallbacks=[
            (getattr(settings, "ESTADISTICAS_SERVICE_URL", None), "/events/stream/"),
        ],
    )


def publish_viewer_metric(stream, event_type):
    canal = getattr(stream, "canal", None)

    payload = {
        "id_stream": stream.id,
        "viewer_count": stream.viewer_count or 0,
        "espectadores_actuales": stream.viewer_count or 0,
        "id_canal": canal.id if canal else None,
    }

    dispatch_event(
        event_type,
        payload,
        http_fallbacks=[
            (getattr(settings, "ESTADISTICAS_SERVICE_URL", None), "/events/stream/"),
        ],
    )


def parse_json_body(request):
    try:
        return json.loads(request.body.decode("utf-8") or "{}")
    except json.JSONDecodeError:
        return None


def get_authenticated_user_id(request):
    user_id = get_current_user_id(request)

    if not user_id:
        return None, error_response("No autenticado.", status=401)

    try:
        return int(user_id), None
    except (TypeError, ValueError):
        return None, error_response("Token de usuario invalido.", status=401)


def get_owned_channel(request):
    user_id, response = get_authenticated_user_id(request)

    if response:
        return None, response

    canal = (
        Canal.objects.select_related("tipo_canal")
        .filter(id_usuario_propietario=user_id)
        .first()
    )

    if not canal:
        return None, error_response("Primero debes activar un canal de creador.", status=403)

    return canal, None


def validate_streamer_channel(canal):
    if canal.estado_canal != Canal.ACTIVO:
        return error_response("El canal no esta activo.", status=403)

    if canal.tipo_canal.nombre_tipo != TipoCanal.STREAMER:
        return error_response(
            "Solo los canales de tipo streamer pueden operar transmisiones en vivo.",
            status=403,
        )

    return None


def get_owned_stream(request, stream_id):
    user_id, response = get_authenticated_user_id(request)

    if response:
        return None, response

    try:
        stream = (
            Stream.objects.select_related("canal", "canal__tipo_canal", "categoria")
            .prefetch_related("configuracion")
            .get(id=stream_id)
        )
    except Stream.DoesNotExist:
        return None, error_response("Stream no encontrado.", status=404)

    if stream.canal.id_usuario_propietario != user_id:
        return None, error_response("No puedes operar un stream de otro canal.", status=403)

    return stream, None


def sync_signal_status(stream):
    """
    Sincroniza la senal OBS contra MediaMTX.
    No publica claves privadas. Solo actualiza estado tecnico del stream.
    """
    if stream.estado != Stream.EN_VIVO:
        desired_status = (
            Stream.DESCONECTADO
            if stream.estado == Stream.FINALIZADO
            else Stream.SIN_SENAL
        )

        if stream.signal_status != desired_status:
            stream.signal_status = desired_status
            stream.save(update_fields=["signal_status"])

        return stream

    if not stream.stream_key:
        if stream.signal_status != Stream.ERROR:
            stream.signal_status = Stream.ERROR
            stream.save(update_fields=["signal_status"])
        return stream

    probe_base_url = settings.STREAM_PLAYBACK_PROBE_BASE_URL.rstrip("/")
    probe_url = f"{probe_base_url}/{stream.stream_key}/index.m3u8"

    now = timezone.now()

    try:
        with urllib.request.urlopen(probe_url, timeout=2) as response:
            if response.status < 400:
                stream.signal_status = Stream.CONECTADO
                stream.last_signal_at = now
    except urllib.error.HTTPError as exc:
        stream.signal_status = Stream.SIN_SENAL if exc.code == 404 else Stream.ERROR
    except (urllib.error.URLError, TimeoutError):
        if stream.last_signal_at:
            age = (now - stream.last_signal_at).total_seconds()
            stream.signal_status = (
                Stream.DESCONECTADO
                if age > SIGNAL_TIMEOUT_SECONDS
                else Stream.CONECTADO
            )
        else:
            stream.signal_status = Stream.SIN_SENAL

    stream.save(update_fields=["signal_status", "last_signal_at"])
    return stream


def serialize_stream(stream):
    categoria = getattr(stream, "categoria", None)
    canal = getattr(stream, "canal", None)
    configuracion = getattr(stream, "configuracion", None)

    tipo_canal = getattr(canal, "tipo_canal", None) if canal else None

    return {
        "id_stream": stream.id,
        "canal": {
            "id_canal": canal.id if canal else None,
            "nombre_canal": canal.nombre_canal if canal else "",
            "descripcion": canal.descripcion if canal else None,
            "foto_canal": canal.foto_canal if canal else None,
            "banner_canal": canal.banner_canal if canal else None,
            "estado_canal": canal.estado_canal if canal else None,
            "id_usuario_propietario": canal.id_usuario_propietario if canal else None,
            "tipo_canal": {
                "id_tipo_canal": tipo_canal.id if tipo_canal else None,
                "nombre_tipo": tipo_canal.nombre_tipo if tipo_canal else None,
                "descripcion": tipo_canal.descripcion if tipo_canal else None,
            },
        },
        "categoria": {
            "id_categoria": categoria.id if categoria else None,
            "nombre": categoria.nombre if categoria else "",
            "descripcion": categoria.descripcion if categoria else None,
        },
        "titulo": stream.titulo,
        "descripcion": stream.descripcion,
        "estado": stream.estado,
        "playback_url": stream.playback_url,
        "thumbnail_url": stream.thumbnail_url,
        "viewer_count": stream.viewer_count or 0,
        "signal_status": stream.signal_status,
        "last_signal_at": stream.last_signal_at.isoformat() if stream.last_signal_at else None,
        "destacado": stream.destacado,
        "fecha_inicio": stream.fecha_inicio.isoformat() if stream.fecha_inicio else None,
        "fecha_fin": stream.fecha_fin.isoformat() if stream.fecha_fin else None,
        "configuracion": {
            "resolucion": configuracion.resolucion if configuracion else None,
            "bitrate": configuracion.bitrate if configuracion else None,
            "latencia_modo": configuracion.latencia_modo if configuracion else None,
            "audio_activo": configuracion.audio_activo if configuracion else None,
        }
        if configuracion
        else None,
    }


def serialize_obs_config(stream):
    return {
        "id_stream": stream.id,
        "server": settings.STREAM_RTMP_SERVER.rstrip("/"),
        "stream_key": stream.stream_key,
        "ingest_url": stream.ingest_url,
        "playback_url": stream.playback_url,
        "signal_status": stream.signal_status,
        "last_signal_at": stream.last_signal_at.isoformat() if stream.last_signal_at else None,
    }


@require_http_methods(["GET"])
def listar_streams(request):
    streams = (
        Stream.objects.select_related("canal", "canal__tipo_canal", "categoria")
        .prefetch_related("configuracion")
        .all()
        .order_by("-fecha_inicio", "-id")
    )

    estado = request.GET.get("estado")
    categoria_id = request.GET.get("categoria")
    canal_id = request.GET.get("canal")
    q = request.GET.get("q")

    if estado:
        streams = streams.filter(estado=estado)

    if categoria_id:
        streams = streams.filter(categoria_id=categoria_id)

    if canal_id:
        streams = streams.filter(canal_id=canal_id)

    if q:
        streams = streams.filter(titulo__icontains=q)

    data = [serialize_stream(stream) for stream in streams]

    return success_response({"count": len(data), "results": data})


@require_http_methods(["GET"])
def streams_en_vivo(request):
    streams = (
        Stream.objects.select_related("canal", "canal__tipo_canal", "categoria")
        .prefetch_related("configuracion")
        .filter(estado=Stream.EN_VIVO)
        .order_by("-fecha_inicio", "-id")
    )

    data = [serialize_stream(sync_signal_status(stream)) for stream in streams]

    return success_response({"count": len(data), "results": data})


@require_http_methods(["GET"])
def streams_destacados(request):
    streams = (
        Stream.objects.select_related("canal", "canal__tipo_canal", "categoria")
        .prefetch_related("configuracion")
        .filter(destacado=True, estado=Stream.EN_VIVO)
        .order_by("-fecha_inicio", "-id")
    )

    data = [serialize_stream(sync_signal_status(stream)) for stream in streams]

    return success_response({"count": len(data), "results": data})


@require_http_methods(["GET"])
def detalle_stream(request, stream_id):
    try:
        stream = (
            Stream.objects.select_related("canal", "canal__tipo_canal", "categoria")
            .prefetch_related("configuracion")
            .get(id=stream_id)
        )
    except Stream.DoesNotExist:
        return error_response("Stream no encontrado.", status=404)

    return success_response(serialize_stream(sync_signal_status(stream)))


@require_http_methods(["GET"])
def mis_streams(request):
    user_id, response = get_authenticated_user_id(request)

    if response:
        return response

    canal = (
        Canal.objects.select_related("tipo_canal")
        .filter(id_usuario_propietario=user_id)
        .first()
    )

    if not canal:
        return success_response({"count": 0, "results": []})

    streams = (
        Stream.objects.select_related("canal", "canal__tipo_canal", "categoria")
        .prefetch_related("configuracion")
        .filter(canal=canal)
        .order_by("-fecha_inicio", "-id")
    )

    data = [serialize_stream(sync_signal_status(stream)) for stream in streams]

    return success_response({"count": len(data), "results": data})


@csrf_exempt
@require_http_methods(["POST"])
def crear_stream(request):
    canal, response = get_owned_channel(request)

    if response:
        return response

    channel_error = validate_streamer_channel(canal)

    if channel_error:
        return channel_error

    body = parse_json_body(request)

    if body is None:
        return error_response("JSON invalido.", status=400)

    titulo = (body.get("titulo") or "").strip()
    descripcion = (body.get("descripcion") or "").strip()
    categoria_id = body.get("id_categoria")
    destacado = bool(body.get("destacado", False))

    if not titulo:
        return error_response("El titulo del stream es obligatorio.", status=400)

    if len(titulo) > 150:
        return error_response("El titulo no puede superar 150 caracteres.", status=400)

    try:
        categoria = Categoria.objects.get(id=categoria_id)
    except (Categoria.DoesNotExist, TypeError, ValueError):
        return error_response("Categoria no encontrada.", status=404)

    try:
        bitrate = int(body.get("bitrate", 2500))
    except (TypeError, ValueError):
        return error_response("El bitrate debe ser numerico.", status=400)

    if bitrate < 500 or bitrate > 12000:
        return error_response("El bitrate debe estar entre 500 y 12000.", status=400)

    resolucion = body.get("resolucion", "720p")
    calidad_actual = body.get("calidad_actual", resolucion or "720p")
    latencia_modo = body.get("latencia_modo", "normal")

    with transaction.atomic():
        stream = Stream.objects.create(
            canal=canal,
            categoria=categoria,
            titulo=titulo,
            descripcion=descripcion,
            estado=Stream.PROGRAMADO,
            calidad_actual=calidad_actual,
            destacado=destacado,
            thumbnail_url=body.get("thumbnail_url"),
            signal_status=Stream.SIN_SENAL,
            viewer_count=0,
        )

        ConfiguracionStream.objects.create(
            stream=stream,
            resolucion=resolucion,
            bitrate=bitrate,
            latencia_modo=latencia_modo,
            audio_activo=bool(body.get("audio_activo", True)),
        )

    return success_response(
        serialize_stream(stream),
        message="Stream creado correctamente.",
        status=201,
    )


@csrf_exempt
@require_http_methods(["PATCH", "PUT"])
def editar_stream(request, stream_id):
    stream, response = get_owned_stream(request, stream_id)

    if response:
        return response

    channel_error = validate_streamer_channel(stream.canal)

    if channel_error:
        return channel_error

    if stream.estado == Stream.FINALIZADO:
        return error_response("No puedes editar un stream finalizado.", status=409)

    body = parse_json_body(request)

    if body is None:
        return error_response("JSON invalido.", status=400)

    if "titulo" in body:
        titulo = (body.get("titulo") or "").strip()

        if not titulo:
            return error_response("El titulo del stream es obligatorio.", status=400)

        if len(titulo) > 150:
            return error_response("El titulo no puede superar 150 caracteres.", status=400)

        stream.titulo = titulo

    if "descripcion" in body:
        stream.descripcion = (body.get("descripcion") or "").strip()

    if "id_categoria" in body:
        try:
            categoria = Categoria.objects.get(id=body.get("id_categoria"))
        except (Categoria.DoesNotExist, TypeError, ValueError):
            return error_response("Categoria no encontrada.", status=404)

        stream.categoria = categoria

    if "destacado" in body:
        stream.destacado = bool(body.get("destacado"))

    if "calidad_actual" in body:
        calidad_actual = (body.get("calidad_actual") or "").strip()
        stream.calidad_actual = calidad_actual or stream.calidad_actual

    if "thumbnail_url" in body:
        thumbnail_url = (body.get("thumbnail_url") or "").strip()

        if len(thumbnail_url) > 255:
            return error_response("La URL de la miniatura no puede superar 255 caracteres.", status=400)

        stream.thumbnail_url = thumbnail_url or None

    bitrate = None

    if "bitrate" in body:
        try:
            bitrate = int(body.get("bitrate"))
        except (TypeError, ValueError):
            return error_response("El bitrate debe ser numerico.", status=400)

        if bitrate < 500 or bitrate > 12000:
            return error_response("El bitrate debe estar entre 500 y 12000.", status=400)

    with transaction.atomic():
        stream.save()

        configuracion = getattr(stream, "configuracion", None)

        if configuracion:
            if "resolucion" in body:
                configuracion.resolucion = body.get("resolucion") or configuracion.resolucion

            if bitrate is not None:
                configuracion.bitrate = bitrate

            if "latencia_modo" in body:
                configuracion.latencia_modo = body.get("latencia_modo") or configuracion.latencia_modo

            if "audio_activo" in body:
                configuracion.audio_activo = bool(body.get("audio_activo"))

            configuracion.save()

    stream = (
        Stream.objects.select_related("canal", "canal__tipo_canal", "categoria")
        .prefetch_related("configuracion")
        .get(id=stream.id)
    )

    return success_response(
        serialize_stream(stream),
        message="Stream actualizado correctamente.",
    )


@csrf_exempt
@require_http_methods(["POST"])
def iniciar_stream(request, stream_id):
    stream, response = get_owned_stream(request, stream_id)

    if response:
        return response

    channel_error = validate_streamer_channel(stream.canal)

    if channel_error:
        return channel_error

    if stream.estado == Stream.FINALIZADO:
        return error_response("No puedes volver a iniciar un stream finalizado.", status=409)

    if not stream.stream_key:
        return error_response("El stream no tiene clave de transmision.", status=409)

    other_live_exists = (
        Stream.objects.filter(canal=stream.canal, estado=Stream.EN_VIVO)
        .exclude(id=stream.id)
        .exists()
    )

    if other_live_exists:
        return error_response("Ya tienes una transmision en vivo activa.", status=409)

    if stream.estado == Stream.EN_VIVO:
        return success_response(
            serialize_stream(sync_signal_status(stream)),
            message="El stream ya estaba en vivo.",
        )

    stream.estado = Stream.EN_VIVO
    stream.fecha_inicio = timezone.now()
    stream.fecha_fin = None
    stream.signal_status = Stream.SIN_SENAL
    stream.last_signal_at = None
    stream.viewer_count = 0
    stream.save(
        update_fields=[
            "estado",
            "fecha_inicio",
            "fecha_fin",
            "signal_status",
            "last_signal_at",
            "viewer_count",
        ]
    )

    publish_stream_started(stream)

    return success_response(
        serialize_stream(stream),
        message="Stream iniciado correctamente. Esperando senal de OBS.",
    )


@csrf_exempt
@require_http_methods(["POST"])
def finalizar_stream(request, stream_id):
    stream, response = get_owned_stream(request, stream_id)

    if response:
        return response

    if stream.estado == Stream.FINALIZADO:
        return error_response("El stream ya esta finalizado.", status=409)

    if stream.estado != Stream.EN_VIVO:
        return error_response("Solo puedes finalizar un stream que esta en vivo.", status=409)

    stream.estado = Stream.FINALIZADO
    stream.fecha_fin = timezone.now()
    stream.signal_status = Stream.DESCONECTADO
    stream.last_signal_at = None
    stream.viewer_count = 0
    stream.save(
        update_fields=[
            "estado",
            "fecha_fin",
            "signal_status",
            "last_signal_at",
            "viewer_count",
        ]
    )

    publish_stream_ended(stream)

    return success_response(
        serialize_stream(stream),
        message="Stream finalizado correctamente.",
    )


@require_http_methods(["GET"])
def obs_config(request, stream_id):
    stream, response = get_owned_stream(request, stream_id)

    if response:
        return response

    channel_error = validate_streamer_channel(stream.canal)

    if channel_error:
        return channel_error

    if stream.estado == Stream.FINALIZADO:
        return error_response("Este stream ya esta finalizado.", status=409)

    if not stream.stream_key:
        return error_response("El stream no tiene clave de transmision.", status=409)

    return success_response(serialize_obs_config(sync_signal_status(stream)))


@csrf_exempt
@require_http_methods(["POST"])
def rotate_key(request, stream_id):
    stream, response = get_owned_stream(request, stream_id)

    if response:
        return response

    channel_error = validate_streamer_channel(stream.canal)

    if channel_error:
        return channel_error

    if stream.estado == Stream.EN_VIVO:
        return error_response("No puedes regenerar la clave mientras el stream esta en vivo.", status=409)

    if stream.estado == Stream.FINALIZADO:
        return error_response("No puedes regenerar la clave de un stream finalizado.", status=409)

    stream.rotate_stream_key()
    stream.signal_status = Stream.SIN_SENAL
    stream.last_signal_at = None
    stream.save(
        update_fields=[
            "stream_key",
            "ingest_url",
            "playback_url",
            "signal_status",
            "last_signal_at",
        ]
    )

    return success_response(
        serialize_obs_config(stream),
        message="Clave de transmision regenerada correctamente.",
    )


@require_http_methods(["GET"])
def signal_status(request, stream_id):
    try:
        stream = (
            Stream.objects.select_related("canal", "canal__tipo_canal", "categoria")
            .get(id=stream_id)
        )
    except Stream.DoesNotExist:
        return error_response("Stream no encontrado.", status=404)

    stream = sync_signal_status(stream)

    return success_response(
        {
            "id_stream": stream.id,
            "estado": stream.estado,
            "signal_status": stream.signal_status,
            "last_signal_at": stream.last_signal_at.isoformat() if stream.last_signal_at else None,
            "viewer_count": stream.viewer_count or 0,
        }
    )


@csrf_exempt
@require_http_methods(["POST"])
def join_stream_viewer(request, stream_id):
    body = parse_json_body(request)

    if body is None:
        return error_response("JSON invalido.", status=400)

    try:
        with transaction.atomic():
            stream = (
                Stream.objects.select_for_update()
                .select_related("canal")
                .get(id=stream_id)
            )

            if stream.estado != Stream.EN_VIVO:
                StreamViewerSession.objects.filter(stream=stream, active=True).update(active=False)
                stream.viewer_count = 0
                stream.save(update_fields=["viewer_count"])

                return success_response(
                    {
                        "id_stream": stream.id,
                        "viewer_count": stream.viewer_count,
                        "estado": stream.estado,
                    },
                    message="El stream no esta en vivo.",
                    status=200,
                )

            viewer_key = get_viewer_key(request, body)
            user_id = get_current_user_id(request)

            session, created = StreamViewerSession.objects.update_or_create(
                stream=stream,
                viewer_key=viewer_key,
                defaults={
                    "id_usuario": int(user_id) if user_id else None,
                    "ip_address": get_client_ip(request),
                    "user_agent": (request.META.get("HTTP_USER_AGENT") or "")[:255],
                    "active": True,
                },
            )

            viewer_count = expire_old_viewers(stream)

            response_data = {
                "id_stream": stream.id,
                "viewer_count": viewer_count,
                "estado": stream.estado,
                "viewer_key": viewer_key,
                "is_new_session": created,
            }

        if created:
            publish_viewer_metric(stream, "viewer.joined")

        return success_response(
            response_data,
            message="Espectador conectado.",
            status=200,
        )

    except Stream.DoesNotExist:
        return error_response("Stream no encontrado.", status=404)
@csrf_exempt
@require_http_methods(["POST"])
def leave_stream_viewer(request, stream_id):
    body = parse_json_body(request)

    if body is None:
        return error_response("JSON invalido.", status=400)

    try:
        with transaction.atomic():
            stream = (
                Stream.objects.select_for_update()
                .select_related("canal")
                .get(id=stream_id)
            )

            viewer_key = (body.get("viewer_key") or "").strip()

            if viewer_key:
                StreamViewerSession.objects.filter(
                    stream=stream,
                    viewer_key=viewer_key,
                    active=True,
                ).update(active=False)

            if stream.estado != Stream.EN_VIVO:
                StreamViewerSession.objects.filter(stream=stream, active=True).update(active=False)
                viewer_count = 0
            else:
                viewer_count = expire_old_viewers(stream)

            stream.viewer_count = viewer_count
            stream.save(update_fields=["viewer_count"])

            response_data = {
                "id_stream": stream.id,
                "viewer_count": stream.viewer_count,
                "estado": stream.estado,
            }

        publish_viewer_metric(stream, "viewer.left")

        return success_response(
            response_data,
            message="Espectador desconectado.",
            status=200,
        )

    except Stream.DoesNotExist:
        return error_response("Stream no encontrado.", status=404)

@csrf_exempt
@require_http_methods(["POST"])
def heartbeat_stream_viewer(request, stream_id):
    body = parse_json_body(request)

    if body is None:
        return error_response("JSON invalido.", status=400)

    viewer_key = (body.get("viewer_key") or "").strip()

    if not viewer_key:
        return error_response("viewer_key es obligatorio.", status=400)

    try:
        with transaction.atomic():
            stream = (
                Stream.objects.select_for_update()
                .select_related("canal")
                .get(id=stream_id)
            )

            if stream.estado != Stream.EN_VIVO:
                StreamViewerSession.objects.filter(stream=stream, active=True).update(active=False)
                stream.viewer_count = 0
                stream.save(update_fields=["viewer_count"])

                return success_response(
                    {
                        "id_stream": stream.id,
                        "viewer_count": 0,
                        "estado": stream.estado,
                    },
                    message="El stream no esta en vivo.",
                    status=200,
                )

            StreamViewerSession.objects.filter(
                stream=stream,
                viewer_key=viewer_key,
            ).update(
                active=True,
                last_seen_at=timezone.now(),
            )

            viewer_count = expire_old_viewers(stream)

            response_data = {
                "id_stream": stream.id,
                "viewer_count": viewer_count,
                "estado": stream.estado,
                "viewer_key": viewer_key,
            }

        return success_response(
            response_data,
            message="Heartbeat recibido.",
            status=200,
        )

    except Stream.DoesNotExist:
        return error_response("Stream no encontrado.", status=404)
