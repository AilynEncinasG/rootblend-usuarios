from django.views.decorators.http import require_http_methods

from apps.common.responses import success_response
from .models import MomentoDestacado


def serialize_momento(momento):
    return {
        "id_momento": momento.id,
        "id_canal": momento.canal_id,
        "nombre_canal": momento.canal.nombre_canal,
        "titulo": momento.titulo,
        "descripcion": momento.descripcion,
        "url_video": momento.url_video,
        "fecha_subida": momento.fecha_subida.isoformat() if momento.fecha_subida else None,
        "duracion": str(momento.duracion) if momento.duracion else None,
    }


@require_http_methods(["GET"])
def listar_momentos(request):
    momentos = (
        MomentoDestacado.objects.select_related("canal")
        .all()
        .order_by("-fecha_subida", "-id")
    )

    data = [serialize_momento(momento) for momento in momentos]

    return success_response(
        {
            "count": len(data),
            "results": data,
        }
    )