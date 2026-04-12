from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from apps.common.auth import get_authenticated_user
from apps.common.responses import success_response, error_response
from .models import PreferenciaUsuario
from .serializers import PreferenceUpdateSerializer


@method_decorator(csrf_exempt, name="dispatch")
class PreferenceDetailView(View):
    def get(self, request):
        usuario = get_authenticated_user(request)

        if not usuario:
            return error_response(
                message="Usuario no autenticado.",
                errors={"auth": ["Debes iniciar sesion para acceder a este recurso."]},
                status=401,
            )

        try:
            preferencia = PreferenciaUsuario.objects.get(usuario=usuario)
        except PreferenciaUsuario.DoesNotExist:
            preferencia = PreferenciaUsuario.objects.create(usuario=usuario)

        return success_response(
            message="Preferencias obtenidas correctamente.",
            data={
                "preferencias": {
                    "id_preferencia": preferencia.id_preferencia,
                    "idioma": preferencia.idioma,
                    "tema": preferencia.tema,
                    "autoplay": preferencia.autoplay,
                    "recibir_notificaciones": preferencia.recibir_notificaciones,
                }
            },
            status=200,
        )


@method_decorator(csrf_exempt, name="dispatch")
class PreferenceUpdateView(View):
    def put(self, request):
        usuario = get_authenticated_user(request)

        if not usuario:
            return error_response(
                message="Usuario no autenticado.",
                errors={"auth": ["Debes iniciar sesion para acceder a este recurso."]},
                status=401,
            )

        serializer = PreferenceUpdateSerializer(request.body)

        if not serializer.is_valid():
            return error_response(
                message="Datos de preferencias invalidos.",
                errors=serializer.errors,
                status=400,
            )

        try:
            preferencia = PreferenciaUsuario.objects.get(usuario=usuario)
        except PreferenciaUsuario.DoesNotExist:
            preferencia = PreferenciaUsuario.objects.create(usuario=usuario)

        if "idioma" in serializer.data:
            preferencia.idioma = serializer.data["idioma"]

        if "tema" in serializer.data:
            preferencia.tema = serializer.data["tema"]

        if "autoplay" in serializer.data:
            preferencia.autoplay = serializer.data["autoplay"]

        if "recibir_notificaciones" in serializer.data:
            preferencia.recibir_notificaciones = serializer.data["recibir_notificaciones"]

        preferencia.save()

        return success_response(
            message="Preferencias actualizadas correctamente.",
            data={
                "preferencias": {
                    "id_preferencia": preferencia.id_preferencia,
                    "idioma": preferencia.idioma,
                    "tema": preferencia.tema,
                    "autoplay": preferencia.autoplay,
                    "recibir_notificaciones": preferencia.recibir_notificaciones,
                }
            },
            status=200,
        )