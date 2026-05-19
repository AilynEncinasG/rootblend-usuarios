import json
import os
import uuid
from datetime import time

from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.db import transaction
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from apps.canales.models import Canal, TipoCanal
from apps.common.auth import get_current_user_id
from apps.common.responses import error_response, success_response
from apps.streams.models import Stream

from .models import MomentoDestacado


MAX_VIDEO_SIZE = 100 * 1024 * 1024  # 100 MB
MAX_IMAGE_SIZE = 5 * 1024 * 1024    # 5 MB

ALLOWED_VIDEO_TYPES = [
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/quicktime",
]

ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
]


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
        return None, error_response(
            "Primero debes activar un canal de creador.",
            status=403,
        )

    if canal.tipo_canal.nombre_tipo != TipoCanal.STREAMER:
        return None, error_response(
            "Solo los canales streamer pueden gestionar momentos destacados.",
            status=403,
        )

    return canal, None


def parse_duration(value):
    if not value:
        return None, None

    clean_value = str(value).strip()

    if not clean_value:
        return None, None

    try:
        parts = [int(part) for part in clean_value.split(":")]
    except ValueError:
        return None, "La duracion debe tener formato MM:SS o HH:MM:SS."

    if len(parts) == 2:
        hours = 0
        minutes, seconds = parts
    elif len(parts) == 3:
        hours, minutes, seconds = parts
    else:
        return None, "La duracion debe tener formato MM:SS o HH:MM:SS."

    if hours < 0 or minutes < 0 or seconds < 0:
        return None, "La duracion no puede tener valores negativos."

    if hours > 23 or minutes > 59 or seconds > 59:
        return None, "La duracion no puede superar 23:59:59."

    return time(hour=hours, minute=minutes, second=seconds), None


def build_absolute_media_url(request, relative_url):
    absolute_url = request.build_absolute_uri(relative_url)

    absolute_url = absolute_url.replace(
        "http://canales-streaming-service:8001",
        "http://localhost:8080",
    )
    absolute_url = absolute_url.replace(
        "http://0.0.0.0:8001",
        "http://localhost:8080",
    )
    absolute_url = absolute_url.replace(
        "http://127.0.0.1:8001",
        "http://localhost:8080",
    )

    return absolute_url


def safe_file_extension(file_name):
    _base_name, extension = os.path.splitext(file_name or "")
    extension = extension.lower().strip()

    if not extension:
        return ""

    return extension


def serialize_canal(canal):
    tipo_canal = getattr(canal, "tipo_canal", None)

    return {
        "id_canal": canal.id,
        "nombre_canal": canal.nombre_canal,
        "descripcion": canal.descripcion,
        "foto_canal": canal.foto_canal,
        "banner_canal": canal.banner_canal,
        "estado_canal": canal.estado_canal,
        "id_usuario_propietario": canal.id_usuario_propietario,
        "tipo_canal": {
            "id_tipo_canal": tipo_canal.id if tipo_canal else None,
            "nombre_tipo": tipo_canal.nombre_tipo if tipo_canal else None,
            "descripcion": tipo_canal.descripcion if tipo_canal else None,
        },
    }


def serialize_stream_min(stream):
    if not stream:
        return None

    return {
        "id_stream": stream.id,
        "titulo": stream.titulo,
        "estado": stream.estado,
        "thumbnail_url": stream.thumbnail_url,
        "viewer_count": stream.viewer_count or 0,
    }


def serialize_momento(momento):
    canal = momento.canal

    return {
        "id_momento": momento.id,
        "id_canal": momento.canal_id,
        "nombre_canal": canal.nombre_canal,
        "titulo": momento.titulo,
        "descripcion": momento.descripcion,
        "url_video": momento.url_video,
        "thumbnail_url": momento.thumbnail_url,
        "destacado": momento.destacado,
        "vistas_count": momento.vistas_count or 0,
        "fecha_subida": momento.fecha_subida.isoformat()
        if momento.fecha_subida
        else None,
        "duracion": momento.duracion.strftime("%H:%M:%S")
        if momento.duracion
        else None,
        "canal": serialize_canal(canal),
        "stream": serialize_stream_min(momento.stream),
    }


def get_owned_momento(request, momento_id):
    canal, response = get_owned_channel(request)

    if response:
        return None, None, response

    try:
        momento = (
            MomentoDestacado.objects.select_related(
                "canal",
                "canal__tipo_canal",
                "stream",
            )
            .get(id=momento_id)
        )
    except MomentoDestacado.DoesNotExist:
        return None, None, error_response(
            "Momento destacado no encontrado.",
            status=404,
        )

    if momento.canal_id != canal.id:
        return None, None, error_response(
            "No puedes editar un momento de otro canal.",
            status=403,
        )

    return canal, momento, None


def validate_payload(body, canal):
    titulo = (body.get("titulo") or "").strip()
    descripcion = (body.get("descripcion") or "").strip()
    url_video = (body.get("url_video") or "").strip()
    thumbnail_url = (body.get("thumbnail_url") or "").strip()
    stream_id = body.get("id_stream") or body.get("stream_id")
    destacado = bool(body.get("destacado", True))
    duracion, duration_error = parse_duration(body.get("duracion"))

    if not titulo:
        return None, error_response(
            "El titulo del momento es obligatorio.",
            status=400,
        )

    if len(titulo) > 150:
        return None, error_response(
            "El titulo no puede superar 150 caracteres.",
            status=400,
        )

    if not url_video:
        return None, error_response(
            "La URL del video es obligatoria.",
            status=400,
        )

    if not (url_video.startswith("http://") or url_video.startswith("https://")):
        return None, error_response(
            "La URL del video debe empezar con http:// o https://.",
            status=400,
        )

    if thumbnail_url and not (
        thumbnail_url.startswith("http://")
        or thumbnail_url.startswith("https://")
    ):
        return None, error_response(
            "La miniatura debe empezar con http:// o https://.",
            status=400,
        )

    if duration_error:
        return None, error_response(duration_error, status=400)

    stream = None

    if stream_id:
        try:
            stream = Stream.objects.get(id=stream_id, canal=canal)
        except (Stream.DoesNotExist, TypeError, ValueError):
            return None, error_response(
                "Stream origen no encontrado para tu canal.",
                status=404,
            )

    if not thumbnail_url and stream and stream.thumbnail_url:
        thumbnail_url = stream.thumbnail_url

    return {
        "titulo": titulo,
        "descripcion": descripcion,
        "url_video": url_video,
        "thumbnail_url": thumbnail_url,
        "stream": stream,
        "destacado": destacado,
        "duracion": duracion,
    }, None


@require_http_methods(["GET"])
def listar_momentos(request):
    momentos = (
        MomentoDestacado.objects.select_related(
            "canal",
            "canal__tipo_canal",
            "stream",
        )
        .all()
        .order_by("-fecha_subida", "-id")
    )

    canal_id = request.GET.get("canal")
    stream_id = request.GET.get("stream")
    destacados = request.GET.get("destacados")

    if canal_id:
        momentos = momentos.filter(canal_id=canal_id)

    if stream_id:
        momentos = momentos.filter(stream_id=stream_id)

    if destacados is not None:
        momentos = momentos.filter(
            destacado=str(destacados).lower() in ["1", "true", "si", "yes"]
        )

    data = [serialize_momento(momento) for momento in momentos]

    return success_response({"count": len(data), "results": data})


@require_http_methods(["GET"])
def mis_momentos(request):
    canal, response = get_owned_channel(request)

    if response:
        return response

    momentos = (
        MomentoDestacado.objects.select_related(
            "canal",
            "canal__tipo_canal",
            "stream",
        )
        .filter(canal=canal)
        .order_by("-fecha_subida", "-id")
    )

    data = [serialize_momento(momento) for momento in momentos]

    return success_response({"count": len(data), "results": data})


@require_http_methods(["GET"])
def detalle_momento(request, momento_id):
    try:
        momento = (
            MomentoDestacado.objects.select_related(
                "canal",
                "canal__tipo_canal",
                "stream",
            )
            .get(id=momento_id)
        )
    except MomentoDestacado.DoesNotExist:
        return error_response(
            "Momento destacado no encontrado.",
            status=404,
        )

    return success_response(serialize_momento(momento))


@csrf_exempt
@require_http_methods(["POST"])
def crear_momento(request):
    canal, response = get_owned_channel(request)

    if response:
        return response

    body = parse_json_body(request)

    if body is None:
        return error_response("JSON invalido.", status=400)

    payload, payload_error = validate_payload(body, canal)

    if payload_error:
        return payload_error

    with transaction.atomic():
        momento = MomentoDestacado.objects.create(
            canal=canal,
            stream=payload["stream"],
            titulo=payload["titulo"],
            descripcion=payload["descripcion"],
            url_video=payload["url_video"],
            thumbnail_url=payload["thumbnail_url"],
            destacado=payload["destacado"],
            duracion=payload["duracion"],
        )

    momento = (
        MomentoDestacado.objects.select_related(
            "canal",
            "canal__tipo_canal",
            "stream",
        )
        .get(id=momento.id)
    )

    return success_response(
        serialize_momento(momento),
        message="Momento destacado creado correctamente.",
        status=201,
    )


@csrf_exempt
@require_http_methods(["PATCH", "PUT"])
def editar_momento(request, momento_id):
    canal, momento, response = get_owned_momento(request, momento_id)

    if response:
        return response

    body = parse_json_body(request)

    if body is None:
        return error_response("JSON invalido.", status=400)

    merged_body = {
        "titulo": body.get("titulo", momento.titulo),
        "descripcion": body.get("descripcion", momento.descripcion),
        "url_video": body.get("url_video", momento.url_video),
        "thumbnail_url": body.get("thumbnail_url", momento.thumbnail_url),
        "id_stream": body.get("id_stream", momento.stream_id),
        "destacado": body.get("destacado", momento.destacado),
        "duracion": body.get(
            "duracion",
            momento.duracion.strftime("%H:%M:%S")
            if momento.duracion
            else None,
        ),
    }

    payload, payload_error = validate_payload(merged_body, canal)

    if payload_error:
        return payload_error

    momento.stream = payload["stream"]
    momento.titulo = payload["titulo"]
    momento.descripcion = payload["descripcion"]
    momento.url_video = payload["url_video"]
    momento.thumbnail_url = payload["thumbnail_url"]
    momento.destacado = payload["destacado"]
    momento.duracion = payload["duracion"]
    momento.save()

    momento = (
        MomentoDestacado.objects.select_related(
            "canal",
            "canal__tipo_canal",
            "stream",
        )
        .get(id=momento.id)
    )

    return success_response(
        serialize_momento(momento),
        message="Momento destacado actualizado correctamente.",
    )


@csrf_exempt
@require_http_methods(["DELETE"])
def eliminar_momento(request, momento_id):
    _canal, momento, response = get_owned_momento(request, momento_id)

    if response:
        return response

    momento.delete()

    return success_response(
        {"id_momento": momento_id},
        message="Momento destacado eliminado correctamente.",
    )


@csrf_exempt
@require_http_methods(["POST"])
def upload_momento_media(request):
    canal, response = get_owned_channel(request)

    if response:
        return response

    tipo = (request.POST.get("tipo") or "").strip().lower()
    archivo = request.FILES.get("archivo")

    if tipo not in ["video", "miniatura"]:
        return error_response(
            "Tipo invalido. Usa 'video' o 'miniatura'.",
            status=400,
        )

    if not archivo:
        return error_response("Debes enviar un archivo.", status=400)

    content_type = archivo.content_type or ""

    if tipo == "video":
        if content_type not in ALLOWED_VIDEO_TYPES:
            return error_response(
                "Formato de video no permitido. Usa MP4, WEBM, OGG o MOV.",
                status=400,
            )

        if archivo.size > MAX_VIDEO_SIZE:
            return error_response(
                "El video no puede superar los 100 MB.",
                status=400,
            )

        subfolder = "momentos/videos"

    else:
        if content_type not in ALLOWED_IMAGE_TYPES:
            return error_response(
                "Formato de miniatura no permitido. Usa JPG, PNG, WEBP o GIF.",
                status=400,
            )

        if archivo.size > MAX_IMAGE_SIZE:
            return error_response(
                "La miniatura no puede superar los 5 MB.",
                status=400,
            )

        subfolder = "momentos/miniaturas"

    extension = safe_file_extension(archivo.name)
    file_name = f"canal_{canal.id}_{tipo}_{uuid.uuid4().hex}{extension}"

    location = os.path.join(settings.MEDIA_ROOT, subfolder)
    base_url = f"{settings.MEDIA_URL}{subfolder}/"

    storage = FileSystemStorage(location=location, base_url=base_url)
    saved_name = storage.save(file_name, archivo)
    relative_url = storage.url(saved_name)
    public_url = build_absolute_media_url(request, relative_url)

    return success_response(
        {
            "url": public_url,
            "tipo": tipo,
            "nombre_archivo": saved_name,
            "content_type": content_type,
            "size": archivo.size,
        },
        message="Archivo subido correctamente.",
        status=201,
    )