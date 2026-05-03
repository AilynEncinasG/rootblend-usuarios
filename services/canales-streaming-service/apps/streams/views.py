import json

from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from apps.canales.models import Canal, TipoCanal
from apps.common.auth import get_current_user_id
from apps.common.responses import error_response, success_response
from apps.categorias.models import Categoria
from .models import ConfiguracionStream, Stream


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
    q = request.GET.get("q")

    if estado:
        streams = streams.filter(estado=estado)

    if categoria_id:
        streams = streams.filter(categoria_id=categoria_id)

    if q:
        streams = streams.filter(titulo__icontains=q)

    data = [serialize_stream(stream) for stream in streams]

    return success_response(
        {
            "count": len(data),
            "results": data,
        }
    )


@require_http_methods(["GET"])
def streams_en_vivo(request):
    streams = (
        Stream.objects.select_related("canal", "canal__tipo_canal", "categoria")
        .prefetch_related("configuracion")
        .filter(estado=Stream.EN_VIVO)
        .order_by("-fecha_inicio", "-id")
    )

    data = [serialize_stream(stream) for stream in streams]

    return success_response(
        {
            "count": len(data),
            "results": data,
        }
    )


@require_http_methods(["GET"])
def streams_destacados(request):
    streams = (
        Stream.objects.select_related("canal", "canal__tipo_canal", "categoria")
        .prefetch_related("configuracion")
        .filter(destacado=True, estado=Stream.EN_VIVO)
        .order_by("-fecha_inicio", "-id")
    )

    data = [serialize_stream(stream) for stream in streams]

    return success_response(
        {
            "count": len(data),
            "results": data,
        }
    )


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

    return success_response(serialize_stream(stream))


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

    if canal.tipo_canal.nombre_tipo != TipoCanal.STREAMER:
        return error_response(
            "Solo los canales de tipo streamer pueden crear transmisiones.",
            status=403,
        )

    try:
        body = json.loads(request.body.decode("utf-8") or "{}")
    except json.JSONDecodeError:
        return error_response("JSON inválido.", status=400)

    titulo = (body.get("titulo") or "").strip()
    descripcion = (body.get("descripcion") or "").strip()
    categoria_id = body.get("id_categoria")
    destacado = bool(body.get("destacado", False))

    if not titulo:
        return error_response("El título del stream es obligatorio.", status=400)

    try:
        categoria = Categoria.objects.get(id=categoria_id)
    except Categoria.DoesNotExist:
        return error_response("Categoría no encontrada.", status=404)

    stream = Stream.objects.create(
        canal=canal,
        categoria=categoria,
        titulo=titulo,
        descripcion=descripcion,
        estado=Stream.PROGRAMADO,
        calidad_actual=body.get("calidad_actual", "720p"),
        destacado=destacado,
    )

    ConfiguracionStream.objects.create(
        stream=stream,
        resolucion=body.get("resolucion", "720p"),
        bitrate=int(body.get("bitrate", 2500)),
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
    user_id = get_current_user_id(request)

    if not user_id:
        return error_response("No autenticado.", status=401)

    try:
        stream = Stream.objects.select_related("canal", "canal__tipo_canal", "categoria").get(id=stream_id)
    except Stream.DoesNotExist:
        return error_response("Stream no encontrado.", status=404)

    if stream.canal.id_usuario_propietario != int(user_id):
        return error_response("No puedes iniciar un stream de otro canal.", status=403)

    if stream.canal.tipo_canal.nombre_tipo != TipoCanal.STREAMER:
        return error_response("Este canal no está habilitado para streaming.", status=403)

    stream.estado = Stream.EN_VIVO
    stream.fecha_inicio = timezone.now()
    stream.fecha_fin = None
    stream.save()

    return success_response(
        serialize_stream(stream),
        message="Stream iniciado correctamente.",
    )


@csrf_exempt
@require_http_methods(["POST"])
def finalizar_stream(request, stream_id):
    user_id = get_current_user_id(request)

    if not user_id:
        return error_response("No autenticado.", status=401)

    try:
        stream = Stream.objects.select_related("canal", "canal__tipo_canal", "categoria").get(id=stream_id)
    except Stream.DoesNotExist:
        return error_response("Stream no encontrado.", status=404)

    if stream.canal.id_usuario_propietario != int(user_id):
        return error_response("No puedes finalizar un stream de otro canal.", status=403)

    stream.estado = Stream.FINALIZADO
    stream.fecha_fin = timezone.now()
    stream.save()

    return success_response(
        serialize_stream(stream),
        message="Stream finalizado correctamente.",
    )