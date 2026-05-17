import os
from datetime import date
from uuid import uuid4

from django.conf import settings
from django.core.files.storage import default_storage
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from apps.common.auth import get_authenticated_user
from apps.common.responses import success_response, error_response
from .models import PerfilUsuario
from .serializers import ProfileUpdateSerializer


def get_or_create_profile(usuario):
    try:
        return PerfilUsuario.objects.get(usuario=usuario)
    except PerfilUsuario.DoesNotExist:
        return PerfilUsuario.objects.create(
            usuario=usuario,
            nombre_visible=usuario.correo.split("@")[0],
        )


def serialize_profile(perfil):
    return {
        "id_perfil": perfil.id_perfil if perfil else None,
        "nombre_visible": perfil.nombre_visible if perfil else None,
        "foto_perfil": perfil.foto_perfil if perfil else None,
        "biografia": perfil.biografia if perfil else None,
        "fecha_nacimiento": (
            perfil.fecha_nacimiento.isoformat()
            if perfil and perfil.fecha_nacimiento
            else None
        ),
    }


def build_public_media_url(saved_path):
    media_path = f"{settings.MEDIA_URL}{saved_path}".replace("//", "/")
    public_base = getattr(settings, "PUBLIC_MEDIA_BASE_URL", "").rstrip("/")

    if public_base:
        return f"{public_base}{media_path}"

    return media_path


def delete_old_local_profile_image(foto_perfil_url):
    if not foto_perfil_url:
        return

    marker = "/media/"

    if marker not in foto_perfil_url:
        return

    old_path = foto_perfil_url.split(marker, 1)[1]

    if old_path and default_storage.exists(old_path):
        default_storage.delete(old_path)


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
                    "fecha_registro": (
                        usuario.fecha_registro.isoformat()
                        if usuario.fecha_registro
                        else None
                    ),
                    "ultimo_acceso": (
                        usuario.ultimo_acceso.isoformat()
                        if usuario.ultimo_acceso
                        else None
                    ),
                },
                "perfil": serialize_profile(perfil),
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

        perfil = get_or_create_profile(usuario)

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
                        errors={
                            "fecha_nacimiento": [
                                "La fecha_nacimiento debe tener formato YYYY-MM-DD."
                            ]
                        },
                        status=400,
                    )
            else:
                perfil.fecha_nacimiento = None

        perfil.save()

        return success_response(
            message="Perfil actualizado correctamente.",
            data={
                "perfil": serialize_profile(perfil),
            },
            status=200,
        )


@method_decorator(csrf_exempt, name="dispatch")
class UploadProfilePhotoView(View):
    def post(self, request):
        usuario = get_authenticated_user(request)

        if not usuario:
            return error_response(
                message="Usuario no autenticado.",
                errors={"auth": ["Debes iniciar sesion para subir una imagen."]},
                status=401,
            )

        archivo = request.FILES.get("foto_perfil") or request.FILES.get("file")

        if not archivo:
            return error_response(
                message="No se recibio ninguna imagen.",
                errors={"foto_perfil": ["Selecciona una imagen para subir."]},
                status=400,
            )

        max_size = 3 * 1024 * 1024

        if archivo.size > max_size:
            return error_response(
                message="La imagen es demasiado grande.",
                errors={"foto_perfil": ["La imagen no debe superar los 3 MB."]},
                status=400,
            )

        extension = os.path.splitext(archivo.name)[1].lower()
        allowed_extensions = {".jpg", ".jpeg", ".png", ".webp", ".gif"}

        if extension not in allowed_extensions:
            return error_response(
                message="Formato de imagen no permitido.",
                errors={
                    "foto_perfil": [
                        "Solo se permiten imagenes JPG, JPEG, PNG, WEBP o GIF."
                    ]
                },
                status=400,
            )

        content_type = getattr(archivo, "content_type", "") or ""

        if content_type and not content_type.startswith("image/"):
            return error_response(
                message="El archivo seleccionado no parece ser una imagen.",
                errors={"foto_perfil": ["Selecciona un archivo de imagen valido."]},
                status=400,
            )

        perfil = get_or_create_profile(usuario)

        delete_old_local_profile_image(perfil.foto_perfil)

        safe_extension = extension if extension else ".png"
        filename = f"perfiles/usuario_{usuario.id_usuario}_{uuid4().hex}{safe_extension}"

        saved_path = default_storage.save(filename, archivo)
        public_url = build_public_media_url(saved_path)

        perfil.foto_perfil = public_url
        perfil.save()

        return success_response(
            message="Foto de perfil subida correctamente.",
            data={
                "foto_perfil": public_url,
                "perfil": serialize_profile(perfil),
            },
            status=200,
        )