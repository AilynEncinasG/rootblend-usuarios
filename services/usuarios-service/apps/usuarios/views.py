from datetime import date
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from apps.common.auth import get_authenticated_user
from apps.common.responses import success_response, error_response
from .models import PerfilUsuario
from .serializers import ProfileUpdateSerializer


@method_decorator(csrf_exempt, name="dispatch")
class MeView(View):
    def get(self, request):
        usuario = get_authenticated_user(request)

        if not usuario:
            return error_response(
                message="Usuario no autenticado.",
                errors={"auth": ["Debes iniciar sesion para acceder a este recurso."]},
                status=401,
            )

        try:
            perfil = PerfilUsuario.objects.get(usuario=usuario)
        except PerfilUsuario.DoesNotExist:
            perfil = None

        return success_response(
            message="Informacion de cuenta obtenida correctamente.",
            data={
                "usuario": {
                    "id_usuario": usuario.id_usuario,
                    "correo": usuario.correo,
                    "estado": usuario.estado,
                    "fecha_registro": usuario.fecha_registro.isoformat() if usuario.fecha_registro else None,
                    "ultimo_acceso": usuario.ultimo_acceso.isoformat() if usuario.ultimo_acceso else None,
                },
                "perfil": {
                    "id_perfil": perfil.id_perfil if perfil else None,
                    "nombre_visible": perfil.nombre_visible if perfil else None,
                    "foto_perfil": perfil.foto_perfil if perfil else None,
                    "biografia": perfil.biografia if perfil else None,
                    "fecha_nacimiento": perfil.fecha_nacimiento.isoformat() if perfil and perfil.fecha_nacimiento else None,
                }
            },
            status=200,
        )


@method_decorator(csrf_exempt, name="dispatch")
class UpdateProfileView(View):
    def put(self, request):
        usuario = get_authenticated_user(request)

        if not usuario:
            return error_response(
                message="Usuario no autenticado.",
                errors={"auth": ["Debes iniciar sesion para acceder a este recurso."]},
                status=401,
            )

        serializer = ProfileUpdateSerializer(request.body)

        if not serializer.is_valid():
            return error_response(
                message="Datos de perfil invalidos.",
                errors=serializer.errors,
                status=400,
            )

        try:
            perfil = PerfilUsuario.objects.get(usuario=usuario)
        except PerfilUsuario.DoesNotExist:
            perfil = PerfilUsuario.objects.create(
                usuario=usuario,
                nombre_visible=usuario.correo.split("@")[0],
            )

        if "nombre_visible" in serializer.data:
            perfil.nombre_visible = serializer.data["nombre_visible"]

        if "foto_perfil" in serializer.data:
            perfil.foto_perfil = serializer.data["foto_perfil"] or None

        if "biografia" in serializer.data:
            perfil.biografia = serializer.data["biografia"] or None

        if "fecha_nacimiento" in serializer.data:
            fecha_value = serializer.data["fecha_nacimiento"]

            if fecha_value:
                try:
                    perfil.fecha_nacimiento = date.fromisoformat(fecha_value)
                except ValueError:
                    return error_response(
                        message="Datos de perfil invalidos.",
                        errors={"fecha_nacimiento": ["La fecha_nacimiento debe tener formato YYYY-MM-DD."]},
                        status=400,
                    )
            else:
                perfil.fecha_nacimiento = None

        perfil.save()

        return success_response(
            message="Perfil actualizado correctamente.",
            data={
                "perfil": {
                    "id_perfil": perfil.id_perfil,
                    "nombre_visible": perfil.nombre_visible,
                    "foto_perfil": perfil.foto_perfil,
                    "biografia": perfil.biografia,
                    "fecha_nacimiento": perfil.fecha_nacimiento.isoformat() if perfil.fecha_nacimiento else None,
                }
            },
            status=200,
        )