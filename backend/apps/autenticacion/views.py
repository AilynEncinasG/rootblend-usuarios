from django.shortcuts import render

# apps/autenticacion/views.py
from django.http import JsonResponse

def login_view(request):
    return JsonResponse({"mensaje": "Login temporal"})

def logout_view(request):
    return JsonResponse({"mensaje": "Logout temporal"})

def registro_view(request):
    return JsonResponse({"mensaje": "Registro temporal"})