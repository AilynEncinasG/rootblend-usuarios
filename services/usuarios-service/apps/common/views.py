from django.http import JsonResponse


def health_view(request):
    return JsonResponse(
        {
            "status": "ok",
            "service": "usuarios-service",
        },
        status=200,
    )