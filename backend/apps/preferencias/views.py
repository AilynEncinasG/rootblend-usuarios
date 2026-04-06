# apps/preferencias/views.py
from django.http import JsonResponse

def ver_preferencias(request, id_usuario):
    return JsonResponse({"mensaje": f"Ver preferencias del usuario {id_usuario}"})

def editar_preferencias(request, id_usuario):
    return JsonResponse({"mensaje": f"Editar preferencias del usuario {id_usuario}"})