import json

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
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
                },
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
            message="Contraseña actualizada correctamente. Por seguridad, vuelve a iniciar sesión.",
            data={
                "sesiones_cerradas": True,
            },
            status=200,
        )

def build_rootblend_reset_email(reset_link):
    subject = "Recupera tu contraseña - ROOTBLEND"

    text_message = f"""
Hola,

Recibimos una solicitud para restablecer tu contraseña en ROOTBLEND.

Abre este enlace para crear una nueva contraseña:

{reset_link}

Si no solicitaste este cambio, puedes ignorar este correo.

Este enlace expira por seguridad.

Equipo ROOTBLEND
"""

    html_message = f"""
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Recupera tu contraseña - ROOTBLEND</title>
  </head>

  <body style="margin:0; padding:0; background:#020617; font-family:Inter, Arial, sans-serif; color:#f8fafc;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#020617; padding:32px 14px;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:620px; overflow:hidden; border-radius:28px; border:1px solid rgba(0,229,255,0.28); background:linear-gradient(135deg, #07111f 0%, #111827 48%, #1e1b4b 100%); box-shadow:0 28px 90px rgba(0,0,0,0.45);">
            
            <tr>
              <td style="padding:34px 32px 18px; text-align:center;">
                <div style="display:inline-block; padding:8px 13px; border-radius:999px; background:rgba(0,229,255,0.12); border:1px solid rgba(0,229,255,0.26); color:#67e8f9; font-size:12px; font-weight:900; letter-spacing:0.08em;">
                  ROOTBLEND SECURITY
                </div>

                <h1 style="margin:22px 0 10px; color:#ffffff; font-size:34px; line-height:1.05; letter-spacing:-0.04em;">
                  Recupera tu contraseña
                </h1>

                <p style="margin:0 auto; max-width:460px; color:rgba(226,232,240,0.82); font-size:15px; line-height:1.7;">
                  Recibimos una solicitud para restablecer tu contraseña en ROOTBLEND.
                  Usa el botón de abajo para crear una nueva contraseña segura.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:16px 32px 8px;">
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-radius:22px; background:rgba(2,6,23,0.58); border:1px solid rgba(148,163,184,0.16);">
                  <tr>
                    <td style="padding:24px; text-align:center;">
                      <div style="width:92px; height:92px; margin:0 auto 18px; border-radius:999px; background:linear-gradient(135deg, #00e5ff, #8b5cf6, #fb7185); display:inline-block; line-height:92px; color:#ffffff; font-size:42px; font-weight:900; box-shadow:0 18px 45px rgba(0,229,255,0.18);">
                        🔐
                      </div>

                      <h2 style="margin:0 0 10px; color:#f8fafc; font-size:22px;">
                        Enlace de recuperación listo
                      </h2>

                      <p style="margin:0 auto 22px; max-width:430px; color:rgba(226,232,240,0.76); font-size:14px; line-height:1.7;">
                        Por seguridad, este enlace es temporal. Si no pediste cambiar tu contraseña,
                        puedes ignorar este correo.
                      </p>

                      <a href="{reset_link}" style="display:inline-block; padding:14px 24px; border-radius:16px; background:linear-gradient(135deg, #00e5ff, #22c55e); color:#04111f; text-decoration:none; font-weight:950; font-size:15px; box-shadow:0 18px 38px rgba(0,229,255,0.22);">
                        Crear nueva contraseña
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:18px 32px 28px;">
                <div style="padding:16px; border-radius:18px; background:rgba(15,23,42,0.68); border:1px solid rgba(148,163,184,0.14);">
                  <p style="margin:0 0 8px; color:#94a3b8; font-size:12px; font-weight:800; letter-spacing:0.06em; text-transform:uppercase;">
                    Si el botón no funciona
                  </p>

                  <p style="margin:0; color:rgba(226,232,240,0.78); font-size:13px; line-height:1.6; word-break:break-all;">
                    Copia y pega este enlace en tu navegador:<br />
                    <a href="{reset_link}" style="color:#67e8f9; text-decoration:none;">{reset_link}</a>
                  </p>
                </div>

                <p style="margin:22px 0 0; text-align:center; color:rgba(226,232,240,0.54); font-size:12px; line-height:1.6;">
                  Este mensaje fue enviado automáticamente por ROOTBLEND.<br />
                  No compartas este enlace con nadie.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
"""

    return subject, text_message, html_message

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
            # Respuesta generica para no revelar si el correo existe o no.
            return success_response(
                message="Si el correo existe, enviamos instrucciones de recuperacion.",
                data={},
                status=200,
            )

        reset_link = (
            f"{settings.FRONTEND_URL.rstrip('/')}/reset-password"
            f"?token={recuperacion.token}"
        )

        subject, text_message, html_message = build_rootblend_reset_email(reset_link)

        try:
            email = EmailMultiAlternatives(
                subject=subject,
                body=text_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[recuperacion.usuario.correo],
            )

            email.attach_alternative(html_message, "text/html")
            email.send(fail_silently=False)

        except Exception:
            return error_response(
                message="No se pudo enviar el correo de recuperacion. Revisa la configuracion SMTP del servicio de usuarios.",
                errors={
                    "email": [
                        "El servidor de correo no esta configurado correctamente."
                    ]
                },
                status=500,
            )

        return success_response(
            message="Si el correo existe, enviamos instrucciones de recuperacion.",
            data={
                "email_enviado": True
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
            message="Contraseña restablecida correctamente. Ya puedes iniciar sesión.",
            data={"password_actualizada": True},
            status=200,
        )