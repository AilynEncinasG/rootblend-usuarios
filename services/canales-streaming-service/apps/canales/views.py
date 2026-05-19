import json
import os
from uuid import uuid4

from django.conf import settings
from django.core.files.storage import default_storage
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from apps.common.auth import get_current_user_id
from apps.common.responses import error_response, success_response
from .models import Canal, TipoCanal


def parse_json_body(request):
    try:
        return json.loads(request.body.decode("utf-8") or "{}")
    except json.JSONDecodeError:
        return None


def clean_text(value, default=""):
    if value is None:
        return default

    if isinstance(value, str):
        return value.strip()

    return str(value).strip()


def is_valid_image_url(value):
    if not value:
        return True

    clean_value = str(value).strip().lower()
    return clean_value.startswith("http://") or clean_value.startswith("https://")


def serialize_tipo_canal(tipo):
    return {
        "id_tipo_canal": tipo.id,
        "nombre_tipo": tipo.nombre_tipo,
        "descripcion": tipo.descripcion,
    }


def serialize_canal(canal):
    return {
        "id_canal": canal.id,
        "id_usuario_propietario": canal.id_usuario_propietario,
        "tipo_canal": serialize_tipo_canal(canal.tipo_canal),
        "nombre_canal": canal.nombre_canal,
        "descripcion": canal.descripcion,
        "foto_canal": canal.foto_canal,
        "banner_canal": canal.banner_canal,
        "estado_canal": canal.estado_canal,
        "fecha_creacion": canal.fecha_creacion.isoformat()
        if canal.fecha_creacion
        else None,
    }


def build_public_media_url(saved_path):
    public_base = getattr(
        settings,
        "PUBLIC_CHANNEL_MEDIA_BASE_URL",
        "http://localhost:8080/canales-media",
    ).rstrip("/")

    return f"{public_base}/{str(saved_path).lstrip('/')}"


def delete_old_local_channel_image(image_url):
    if not image_url:
        return

    old_path = ""

    for marker in ["/canales-media/", "/media/"]:
        if marker in image_url:
            old_path = image_url.split(marker, 1)[1]
            break

    if old_path and default_storage.exists(old_path):
        default_storage.delete(old_path)


def get_my_channel_or_response(request):
    user_id = get_current_user_id(request)

    if not user_id:
        return None, error_response("No autenticado.", status=401)

    canal = (
        Canal.objects.select_related("tipo_canal")
        .filter(id_usuario_propietario=user_id)
        .first()
    )

    if not canal:
        return None, error_response("El usuario todavía no tiene canal.", status=404)

    return canal, None


@require_http_methods(["GET"])
def listar_canales(request):
    canales = Canal.objects.select_related("tipo_canal").all().order_by("nombre_canal")
    data = [serialize_canal(canal) for canal in canales]

    return success_response(
        {
            "count": len(data),
            "results": data,
        }
    )


@require_http_methods(["GET"])
def listar_canales_activos(request):
    canales = (
        Canal.objects.select_related("tipo_canal")
        .filter(estado_canal=Canal.ACTIVO)
        .order_by("nombre_canal")
    )
    data = [serialize_canal(canal) for canal in canales]

    return success_response(
        {
            "count": len(data),
            "results": data,
        }
    )


@require_http_methods(["GET"])
def detalle_canal(request, canal_id):
    try:
        canal = Canal.objects.select_related("tipo_canal").get(id=canal_id)
    except Canal.DoesNotExist:
        return error_response("Canal no encontrado.", status=404)

    return success_response(serialize_canal(canal))


@require_http_methods(["GET"])
def mi_canal(request):
    user_id = get_current_user_id(request)

    if not user_id:
        return error_response("No autenticado.", status=401)

    canal = (
        Canal.objects.select_related("tipo_canal")
        .filter(id_usuario_propietario=user_id)
        .first()
    )

    if not canal:
        return success_response(
            {
                "tiene_canal": False,
                "canal": None,
            },
            message="El usuario todavía no tiene canal.",
        )

    return success_response(
        {
            "tiene_canal": True,
            "canal": serialize_canal(canal),
        }
    )


@csrf_exempt
@require_http_methods(["POST"])
def activar_canal(request):
    user_id = get_current_user_id(request)

    if not user_id:
        return error_response("No autenticado.", status=401)

    if Canal.objects.filter(id_usuario_propietario=user_id).exists():
        return error_response("Este usuario ya tiene un canal activo.", status=409)

    body = parse_json_body(request)

    if body is None:
        return error_response("JSON inválido.", status=400)

    nombre_canal = clean_text(body.get("nombre_canal"))
    tipo_canal_nombre = clean_text(body.get("tipo_canal")).lower()
    descripcion = clean_text(body.get("descripcion"))

    if not nombre_canal:
        return error_response("El nombre del canal es obligatorio.", status=400)

    if len(nombre_canal) > 100:
        return error_response(
            "El nombre del canal no puede superar 100 caracteres.",
            status=400,
        )

    if tipo_canal_nombre not in [TipoCanal.STREAMER, TipoCanal.PODCASTER]:
        return error_response(
            "El tipo de canal debe ser 'streamer' o 'podcaster'.",
            status=400,
        )

    if Canal.objects.filter(nombre_canal=nombre_canal).exists():
        return error_response("El nombre del canal ya está en uso.", status=409)

    tipo_canal, _ = TipoCanal.objects.get_or_create(
        nombre_tipo=tipo_canal_nombre,
        defaults={
            "descripcion": (
                "Canal para transmisiones en vivo"
                if tipo_canal_nombre == TipoCanal.STREAMER
                else "Canal para contenido en formato podcast"
            )
        },
    )

    canal = Canal.objects.create(
        id_usuario_propietario=user_id,
        tipo_canal=tipo_canal,
        nombre_canal=nombre_canal,
        descripcion=descripcion,
        estado_canal=Canal.ACTIVO,
    )

    return success_response(
        {
            "tiene_canal": True,
            "canal": serialize_canal(canal),
        },
        message="Canal activado correctamente.",
        status=201,
    )


@csrf_exempt
@require_http_methods(["PUT", "PATCH"])
def actualizar_mi_canal(request):
    canal, response = get_my_channel_or_response(request)

    if response:
        return response

    body = parse_json_body(request)

    if body is None:
        return error_response("JSON inválido.", status=400)

    if "nombre_canal" in body:
        nombre_canal = clean_text(body.get("nombre_canal"))

        if not nombre_canal:
            return error_response("El nombre del canal no puede estar vacío.", status=400)

        if len(nombre_canal) > 100:
            return error_response(
                "El nombre del canal no puede superar 100 caracteres.",
                status=400,
            )

        duplicated = (
            Canal.objects.exclude(id=canal.id)
            .filter(nombre_canal=nombre_canal)
            .exists()
        )

        if duplicated:
            return error_response("El nombre del canal ya está en uso.", status=409)

        canal.nombre_canal = nombre_canal

    if "descripcion" in body:
        canal.descripcion = clean_text(body.get("descripcion")) or None

    if "foto_canal" in body:
        foto_canal = clean_text(body.get("foto_canal"))

        if foto_canal and not is_valid_image_url(foto_canal):
            return error_response(
                "La foto del canal debe ser una URL válida que empiece con http:// o https://.",
                status=400,
            )

        if len(foto_canal) > 255:
            return error_response(
                "La URL de la foto del canal no puede superar 255 caracteres.",
                status=400,
            )

        canal.foto_canal = foto_canal or None

    if "banner_canal" in body:
        banner_canal = clean_text(body.get("banner_canal"))

        if banner_canal and not is_valid_image_url(banner_canal):
            return error_response(
                "El banner del canal debe ser una URL válida que empiece con http:// o https://.",
                status=400,
            )

        if len(banner_canal) > 255:
            return error_response(
                "La URL del banner del canal no puede superar 255 caracteres.",
                status=400,
            )

        canal.banner_canal = banner_canal or None

    canal.save()

    return success_response(
        {
            "tiene_canal": True,
            "canal": serialize_canal(canal),
        },
        message="Canal actualizado correctamente.",
    )


@csrf_exempt
@require_http_methods(["POST"])
def subir_imagen_mi_canal(request):
    canal, response = get_my_channel_or_response(request)

    if response:
        return response

    image_type = clean_text(request.POST.get("tipo")).lower()
    archivo = request.FILES.get("imagen") or request.FILES.get("file")

    if image_type not in ["foto", "banner"]:
        return error_response(
            "El tipo de imagen debe ser 'foto' o 'banner'.",
            status=400,
        )

    if not archivo:
        return error_response("No se recibió ninguna imagen.", status=400)

    max_size = 5 * 1024 * 1024 if image_type == "banner" else 3 * 1024 * 1024

    if archivo.size > max_size:
        return error_response(
            "La imagen es demasiado grande. Foto máximo 3 MB y banner máximo 5 MB.",
            status=400,
        )

    extension = os.path.splitext(archivo.name)[1].lower()
    allowed_extensions = {".jpg", ".jpeg", ".png", ".webp", ".gif"}

    if extension not in allowed_extensions:
        return error_response(
            "Formato no permitido. Usa JPG, JPEG, PNG, WEBP o GIF.",
            status=400,
        )

    content_type = getattr(archivo, "content_type", "") or ""

    if content_type and not content_type.startswith("image/"):
        return error_response(
            "El archivo seleccionado no parece ser una imagen válida.",
            status=400,
        )

    field_name = "foto_canal" if image_type == "foto" else "banner_canal"
    old_value = getattr(canal, field_name)

    delete_old_local_channel_image(old_value)

    filename = f"canales/canal_{canal.id}_{image_type}_{uuid4().hex}{extension}"

    saved_path = default_storage.save(filename, archivo)
    public_url = build_public_media_url(saved_path)

    if len(public_url) > 255:
        default_storage.delete(saved_path)
        return error_response(
            "La URL generada supera 255 caracteres. Revisa PUBLIC_CHANNEL_MEDIA_BASE_URL.",
            status=500,
        )

    setattr(canal, field_name, public_url)
    canal.save(update_fields=[field_name])

    return success_response(
        {
            "tipo": image_type,
            "campo": field_name,
            "url": public_url,
            "canal": serialize_canal(canal),
        },
        message="Imagen del canal subida correctamente.",
    )