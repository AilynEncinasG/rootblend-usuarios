from django.http import JsonResponse

def home(request):
    return JsonResponse({"message": "Bienvenido a RootBlend Usuarios API"})