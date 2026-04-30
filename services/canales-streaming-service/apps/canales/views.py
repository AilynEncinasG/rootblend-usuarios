import json

from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from apps.common.auth import get_current_user_id
from apps.common.responses import error_response, success_response
from .models import Canal, TipoCanal


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
        "fecha_creacion": canal.fecha_creacion.isoformat() if canal.fecha_creacion else None,
    }


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

    try:
        body = json.loads(request.body.decode("utf-8") or "{}")
    except json.JSONDecodeError:
        return error_response("JSON inválido.", status=400)

    nombre_canal = (body.get("nombre_canal") or "").strip()
    tipo_canal_nombre = (body.get("tipo_canal") or "").strip().lower()
    descripcion = (body.get("descripcion") or "").strip()

    if not nombre_canal:
        return error_response("El nombre del canal es obligatorio.", status=400)

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
    user_id = get_current_user_id(request)

    if not user_id:
        return error_response("No autenticado.", status=401)

    canal = (
        Canal.objects.select_related("tipo_canal")
        .filter(id_usuario_propietario=user_id)
        .first()
    )

    if not canal:
        return error_response("El usuario todavía no tiene canal.", status=404)

    try:
        body = json.loads(request.body.decode("utf-8") or "{}")
    except json.JSONDecodeError:
        return error_response("JSON inválido.", status=400)

    for field in ["nombre_canal", "descripcion", "foto_canal", "banner_canal"]:
        if field in body:
            value = body.get(field)
            setattr(canal, field, value.strip() if isinstance(value, str) else value)

    if "nombre_canal" in body and not canal.nombre_canal:
        return error_response("El nombre del canal no puede estar vacío.", status=400)

    if (
        "nombre_canal" in body
        and Canal.objects.exclude(id=canal.id).filter(nombre_canal=canal.nombre_canal).exists()
    ):
        return error_response("El nombre del canal ya está en uso.", status=409)

    canal.save()

    return success_response(
        serialize_canal(canal),
        message="Canal actualizado correctamente.",
    )