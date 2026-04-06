# apps/usuarios/views.py
from django.http import JsonResponse

def lista_usuarios(request):
    return JsonResponse({"usuarios": []})

def detalle_usuario(request, id):
    return JsonResponse({"usuario_id": id})