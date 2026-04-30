from django.views.decorators.http import require_http_methods

from apps.common.responses import success_response
from .models import Categoria


def serialize_categoria(categoria):
    return {
        "id_categoria": categoria.id,
        "nombre": categoria.nombre,
        "descripcion": categoria.descripcion,
    }


@require_http_methods(["GET"])
def listar_categorias(request):
    categorias = Categoria.objects.all().order_by("nombre")
    data = [serialize_categoria(categoria) for categoria in categorias]

    return success_response(
        {
            "count": len(data),
            "results": data,
        }
    )