from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from apps.common.auth import get_authenticated_user
from apps.common.responses import success_response, error_response
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    ChangePasswordSerializer,
    ForgotPasswordSerializer,
    ResetPasswordSerializer,
)
from .services import (
    register_user,
    login_user,
    logout_user,
    change_user_password,
    forgot_password,
    reset_password,
    refresh_access_token,
)
import json


@method_decorator(csrf_exempt, name="dispatch")
class RegisterView(View):
    def post(self, request):
        serializer = RegisterSerializer(request.body)

        if not serializer.is_valid():
            return error_response(
                message="Datos de registro invalidos.",
                errors=serializer.errors,
                status=400,
            )

        correo = serializer.data["correo"]
        password = serializer.data["password"]

        usuario, errors = register_user(correo=correo, password=password)

        if errors:
            return error_response(
                message="No se pudo registrar el usuario.",
                errors=errors,
                status=400,
            )

        return success_response(
            message="Usuario registrado correctamente.",
            data={
                "usuario": {
                    "id_usuario": usuario.id_usuario,
                    "correo": usuario.correo,
                    "estado": usuario.estado,
                }
            },
            status=201,
        )


@method_decorator(csrf_exempt, name="dispatch")
class LoginView(View):
    def post(self, request):
        serializer = LoginSerializer(request.body)

        if not serializer.is_valid():
            return error_response(
                message="Datos de inicio de sesion invalidos.",
                errors=serializer.errors,
                status=400,
            )

        correo = serializer.data["correo"]
        password = serializer.data["password"]
        ip = request.META.get("REMOTE_ADDR")

        usuario, access_token, refresh_token, result = login_user(
            correo=correo,
            password=password,
            ip=ip,
        )

        if isinstance(result, dict) and "expires_in" not in result:
            return error_response(
                message="No se pudo iniciar sesion.",
                errors=result,
                status=400,
            )

        return success_response(
            message="Inicio de sesion exitoso.",
            data={
                "access_token": access_token,
                "refresh_token": refresh_token,
                "token_type": "Bearer",
                "expires_in": result["expires_in"],
                "usuario": {
                    "id_usuario": usuario.id_usuario,
                    "correo": usuario.correo,
                    "estado": usuario.estado,
                }
            },
            status=200,
        )


@method_decorator(csrf_exempt, name="dispatch")
class RefreshTokenView(View):
    def post(self, request):
        try:
            body = json.loads(request.body.decode("utf-8"))
        except Exception:
            body = {}

        refresh_token = body.get("refresh_token", "").strip()

        if not refresh_token:
            return error_response(
                message="Refresh token no proporcionado.",
                errors={"refresh_token": ["Debes enviar un refresh token."]},
                status=400,
            )

        data, errors = refresh_access_token(refresh_token)

        if errors:
            return error_response(
                message="No se pudo refrescar la sesion.",
                errors=errors,
                status=401,
            )

        return success_response(
            message="Token refrescado correctamente.",
            data=data,
            status=200,
        )


@method_decorator(csrf_exempt, name="dispatch")
class LogoutView(View):
    def post(self, request):
        try:
            body = json.loads(request.body.decode("utf-8"))
        except Exception:
            body = {}

        refresh_token = body.get("refresh_token", "").strip()

        if not refresh_token:
            return error_response(
                message="Refresh token no proporcionado.",
                errors={"refresh_token": ["Debes enviar un refresh token."]},
                status=400,
            )

        result = logout_user(refresh_token)

        if not result:
            return error_response(
                message="No se pudo cerrar sesion.",
                errors={"refresh_token": ["La sesion no existe o ya fue cerrada."]},
                status=400,
            )

        return success_response(
            message="Sesion cerrada correctamente.",
            data={},
            status=200,
        )


@method_decorator(csrf_exempt, name="dispatch")
class ChangePasswordView(View):
    def post(self, request):
        usuario = get_authenticated_user(request)

        if not usuario:
            return error_response(
                message="Usuario no autenticado.",
                errors={"auth": ["Debes iniciar sesion para cambiar tu contraseña."]},
                status=401,
            )

        serializer = ChangePasswordSerializer(request.body)

        if not serializer.is_valid():
            return error_response(
                message="Datos invalidos para cambiar contraseña.",
                errors=serializer.errors,
                status=400,
            )

        password_actual = serializer.data["password_actual"]
        password_nueva = serializer.data["password_nueva"]

        errors = change_user_password(
            usuario=usuario,
            password_actual=password_actual,
            password_nueva=password_nueva,
        )

        if errors:
            return error_response(
                message="No se pudo cambiar la contraseña.",
                errors=errors,
                status=400,
            )

        return success_response(
            message="Contraseña actualizada correctamente.",
            data={},
            status=200,
        )


@method_decorator(csrf_exempt, name="dispatch")
class ForgotPasswordView(View):
    def post(self, request):
        serializer = ForgotPasswordSerializer(request.body)

        if not serializer.is_valid():
            return error_response(
                message="Datos invalidos para recuperar contraseña.",
                errors=serializer.errors,
                status=400,
            )

        correo = serializer.data["correo"]

        recuperacion, errors = forgot_password(correo=correo)

        if errors:
            return error_response(
                message="No se pudo iniciar la recuperacion de contraseña.",
                errors=errors,
                status=400,
            )

        return success_response(
            message="Solicitud de recuperacion creada correctamente.",
            data={
                "token_recuperacion": recuperacion.token,
                "expiracion": recuperacion.expiracion.isoformat(),
            },
            status=200,
        )


@method_decorator(csrf_exempt, name="dispatch")
class ResetPasswordView(View):
    def post(self, request):
        serializer = ResetPasswordSerializer(request.body)

        if not serializer.is_valid():
            return error_response(
                message="Datos invalidos para restablecer contraseña.",
                errors=serializer.errors,
                status=400,
            )

        token = serializer.data["token"]
        password_nueva = serializer.data["password_nueva"]

        errors = reset_password(
            token=token,
            password_nueva=password_nueva,
        )

        if errors:
            return error_response(
                message="No se pudo restablecer la contraseña.",
                errors=errors,
                status=400,
            )

        return success_response(
            message="Contraseña restablecida correctamente.",
            data={},
            status=200,
        )