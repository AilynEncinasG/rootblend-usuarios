from django.http import JsonResponse


def health_view(request):
    return JsonResponse(
        {
            "status": "ok",
            "service": "canales-streaming-service",
        },
        status=200,
    )


def api_root_view(request):
    return JsonResponse(
        {
            "service": "canales-streaming-service",
            "status": "ok",
            "endpoints": {
                "health": "/api/health/",
                "categorias": "/api/categorias/",
                "canales": "/api/canales/",
                "mi_canal": "/api/canales/mi-canal/",
                "activar_canal": "/api/canales/activar/",
                "streams": "/api/streams/",
                "streams_en_vivo": "/api/streams/en-vivo/",
                "streams_destacados": "/api/streams/destacados/",
                "momentos": "/api/momentos/",
            },
        },
        status=200,
    )