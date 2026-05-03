import json
import urllib.error
import urllib.request

from django.conf import settings
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from apps.canales.models import Canal, TipoCanal
from apps.common.auth import get_current_user_id
from apps.common.responses import error_response, success_response
from apps.categorias.models import Categoria
from .models import ConfiguracionStream, Stream


def parse_json_body(request):
    try:
        return json.loads(request.body.decode("utf-8") or "{}")
    except json.JSONDecodeError:
        return None


def get_owned_stream(request, stream_id):
    user_id = get_current_user_id(request)

    if not user_id:
        return None, error_response("No autenticado.", status=401)

    try:
        stream = (
            Stream.objects.select_related("canal", "canal__tipo_canal", "categoria")
            .prefetch_related("configuracion")
            .get(id=stream_id)
        )
    except Stream.DoesNotExist:
        return None, error_response("Stream no encontrado.", status=404)

    if stream.canal.id_usuario_propietario != int(user_id):
        return None, error_response("No puedes operar un stream de otro canal.", status=403)

    return stream, None


def sync_signal_status(stream):
    if stream.estado != Stream.EN_VIVO or not stream.stream_key:
        return stream

    probe_base_url = settings.STREAM_PLAYBACK_PROBE_BASE_URL.rstrip("/")
    probe_url = f"{probe_base_url}/{stream.stream_key}/index.m3u8"

    try:
        with urllib.request.urlopen(probe_url, timeout=2) as response:
            if response.status < 400:
                stream.signal_status = Stream.CONECTADO
                stream.last_signal_at = timezone.now()
    except urllib.error.HTTPError as exc:
        stream.signal_status = Stream.SIN_SENAL if exc.code == 404 else Stream.ERROR
    except (urllib.error.URLError, TimeoutError):
        stream.signal_status = Stream.DESCONECTADO if stream.last_signal_at else Stream.SIN_SENAL

    stream.save(update_fields=["signal_status", "last_signal_at", "ingest_url", "playback_url"])
    return stream


def serialize_stream(stream):
    canal = stream.canal
    categoria = stream.categoria
    config = getattr(stream, "configuracion", None)

    return {
        "id_stream": stream.id,
        "titulo": stream.titulo,
        "descripcion": stream.descripcion,
        "estado": stream.estado,
        "fecha_inicio": stream.fecha_inicio.isoformat() if stream.fecha_inicio else None,
        "fecha_fin": stream.fecha_fin.isoformat() if stream.fecha_fin else None,
        "calidad_actual": stream.calidad_actual,
        "destacado": stream.destacado,
        "playback_url": stream.playback_url,
        "thumbnail_url": stream.thumbnail_url,
        "viewer_count": stream.viewer_count,
        "signal_status": stream.signal_status,
        "last_signal_at": stream.last_signal_at.isoformat() if stream.last_signal_at else None,
        "canal": {
            "id_canal": canal.id,
            "nombre_canal": canal.nombre_canal,
            "id_usuario_propietario": canal.id_usuario_propietario,
            "tipo_canal": canal.tipo_canal.nombre_tipo,
        },
        "categoria": {
            "id_categoria": categoria.id,
            "nombre": categoria.nombre,
        },
        "configuracion": {
            "resolucion": config.resolucion if config else None,
            "bitrate": config.bitrate if config else None,
            "latencia_modo": config.latencia_modo if config else None,
            "audio_activo": config.audio_activo if config else None,
        },
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
    user_id = get_current_user_id(request)

    if not user_id:
        return error_response("No autenticado.", status=401)

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

    data = [serialize_stream(stream) for stream in streams]

    return success_response({"count": len(data), "results": data})


@csrf_exempt
@require_http_methods(["POST"])
def crear_stream(request):
    user_id = get_current_user_id(request)

    if not user_id:
        return error_response("No autenticado.", status=401)

    canal = (
        Canal.objects.select_related("tipo_canal")
        .filter(id_usuario_propietario=user_id)
        .first()
    )

    if not canal:
        return error_response("Primero debes activar un canal de creador.", status=403)

    if canal.estado_canal != Canal.ACTIVO:
        return error_response("El canal no esta activo.", status=403)

    if canal.tipo_canal.nombre_tipo != TipoCanal.STREAMER:
        return error_response(
            "Solo los canales de tipo streamer pueden crear transmisiones.",
            status=403,
        )

    body = parse_json_body(request)

    if body is None:
        return error_response("JSON invalido.", status=400)

    titulo = (body.get("titulo") or "").strip()
    descripcion = (body.get("descripcion") or "").strip()
    categoria_id = body.get("id_categoria")
    destacado = bool(body.get("destacado", False))

    if not titulo:
        return error_response("El titulo del stream es obligatorio.", status=400)

    try:
        categoria = Categoria.objects.get(id=categoria_id)
    except Categoria.DoesNotExist:
        return error_response("Categoria no encontrada.", status=404)

    try:
        bitrate = int(body.get("bitrate", 2500))
    except (TypeError, ValueError):
        return error_response("El bitrate debe ser numerico.", status=400)

    stream = Stream.objects.create(
        canal=canal,
        categoria=categoria,
        titulo=titulo,
        descripcion=descripcion,
        estado=Stream.PROGRAMADO,
        calidad_actual=body.get("calidad_actual", "720p"),
        destacado=destacado,
        thumbnail_url=body.get("thumbnail_url"),
        signal_status=Stream.SIN_SENAL,
    )

    ConfiguracionStream.objects.create(
        stream=stream,
        resolucion=body.get("resolucion", "720p"),
        bitrate=bitrate,
        latencia_modo=body.get("latencia_modo", "normal"),
        audio_activo=bool(body.get("audio_activo", True)),
    )

    return success_response(
        serialize_stream(stream),
        message="Stream creado correctamente.",
        status=201,
    )


@csrf_exempt
@require_http_methods(["POST"])
def iniciar_stream(request, stream_id):
    stream, response = get_owned_stream(request, stream_id)

    if response:
        return response

    if stream.estado == Stream.FINALIZADO:
        return error_response("No puedes volver a iniciar un stream finalizado.", status=409)

    if stream.canal.estado_canal != Canal.ACTIVO:
        return error_response("El canal no esta activo.", status=403)

    if stream.canal.tipo_canal.nombre_tipo != TipoCanal.STREAMER:
        return error_response("Este canal no esta habilitado para streaming.", status=403)

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
    stream.save()

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
    stream.save()

    return success_response(
        serialize_stream(stream),
        message="Stream finalizado correctamente.",
    )


@require_http_methods(["GET"])
def obs_config(request, stream_id):
    stream, response = get_owned_stream(request, stream_id)

    if response:
        return response

    if not stream.stream_key:
        return error_response("El stream no tiene clave de transmision.", status=409)

    return success_response(serialize_obs_config(sync_signal_status(stream)))


@csrf_exempt
@require_http_methods(["POST"])
def rotate_key(request, stream_id):
    stream, response = get_owned_stream(request, stream_id)

    if response:
        return response

    if stream.estado == Stream.EN_VIVO:
        return error_response("No puedes regenerar la clave mientras el stream esta en vivo.", status=409)

    stream.rotate_stream_key()
    stream.signal_status = Stream.SIN_SENAL
    stream.last_signal_at = None
    stream.save()

    return success_response(
        serialize_obs_config(stream),
        message="Clave de transmision regenerada correctamente.",
    )


@require_http_methods(["GET"])
def signal_status(request, stream_id):
    try:
        stream = Stream.objects.select_related("canal", "canal__tipo_canal", "categoria").get(id=stream_id)
    except Stream.DoesNotExist:
        return error_response("Stream no encontrado.", status=404)

    stream = sync_signal_status(stream)

    return success_response(
        {
            "id_stream": stream.id,
            "estado": stream.estado,
            "signal_status": stream.signal_status,
            "last_signal_at": stream.last_signal_at.isoformat() if stream.last_signal_at else None,
            "viewer_count": stream.viewer_count,
        }
    )
