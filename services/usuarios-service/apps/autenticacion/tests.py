import json
import secrets
from datetime import timedelta

from django.test import TestCase, Client
from django.utils import timezone

from apps.usuarios.models import Usuario, PerfilUsuario
from apps.autenticacion.models import Credencial, Sesion, RecuperacionPassword
from apps.preferencias.models import PreferenciaUsuario
from apps.autenticacion.services import hash_password


class AutenticacionTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.register_url = "/api/auth/register/"
        self.login_url = "/api/auth/login/"
        self.logout_url = "/api/auth/logout/"
        self.change_password_url = "/api/auth/change-password/"
        self.forgot_password_url = "/api/auth/forgot-password/"
        self.reset_password_url = "/api/auth/reset-password/"

        self.password_plana = "Abc12345"
        self.salt = secrets.token_hex(16)

        self.usuario = Usuario.objects.create(
            correo="demo@rootblend.com",
            estado="activo"
        )

        PerfilUsuario.objects.create(
            usuario=self.usuario,
            nombre_visible="Usuario Demo"
        )

        PreferenciaUsuario.objects.create(
            usuario=self.usuario
        )

        Credencial.objects.create(
            usuario=self.usuario,
            password_hash=hash_password(self.password_plana, self.salt),
            password_salt=self.salt,
            intentos_fallidos=0,
        )

    def test_register_ok(self):
        payload = {
            "correo": "nuevo@rootblend.com",
            "password": "Abc12345"
        }
        response = self.client.post(
            self.register_url,
            data=json.dumps(payload),
            content_type="application/json"
        )

        self.assertEqual(response.status_code, 201)
        self.assertTrue(Usuario.objects.filter(correo="nuevo@rootblend.com").exists())
        self.assertTrue(PerfilUsuario.objects.filter(usuario__correo="nuevo@rootblend.com").exists())
        self.assertTrue(PreferenciaUsuario.objects.filter(usuario__correo="nuevo@rootblend.com").exists())

    def test_register_duplicate_email(self):
        payload = {
            "correo": "demo@rootblend.com",
            "password": "Abc12345"
        }
        response = self.client.post(
            self.register_url,
            data=json.dumps(payload),
            content_type="application/json"
        )

        self.assertEqual(response.status_code, 400)

    def test_login_ok(self):
        payload = {
            "correo": "demo@rootblend.com",
            "password": "Abc12345"
        }
        response = self.client.post(
            self.login_url,
            data=json.dumps(payload),
            content_type="application/json"
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(Sesion.objects.filter(usuario=self.usuario, activa=True).exists())

    def test_login_wrong_password(self):
        payload = {
            "correo": "demo@rootblend.com",
            "password": "mal12345"
        }
        response = self.client.post(
            self.login_url,
            data=json.dumps(payload),
            content_type="application/json"
        )

        self.assertEqual(response.status_code, 400)

    def test_logout_ok(self):
        sesion = Sesion.objects.create(
            usuario=self.usuario,
            token_sesion="token-demo-logout",
            activa=True
        )

        response = self.client.post(
            self.logout_url,
            content_type="application/json",
            HTTP_AUTHORIZATION=f"Bearer {sesion.token_sesion}"
        )

        self.assertEqual(response.status_code, 200)

        sesion.refresh_from_db()
        self.assertFalse(sesion.activa)

    def test_change_password_without_auth(self):
        payload = {
            "password_actual": "Abc12345",
            "password_nueva": "Nueva12345"
        }
        response = self.client.post(
            self.change_password_url,
            data=json.dumps(payload),
            content_type="application/json"
        )

        self.assertEqual(response.status_code, 401)

    def test_change_password_ok(self):
        sesion = Sesion.objects.create(
            usuario=self.usuario,
            token_sesion="token-demo-change",
            activa=True
        )

        payload = {
            "password_actual": "Abc12345",
            "password_nueva": "Nueva12345"
        }
        response = self.client.post(
            self.change_password_url,
            data=json.dumps(payload),
            content_type="application/json",
            HTTP_AUTHORIZATION=f"Bearer {sesion.token_sesion}"
        )

        self.assertEqual(response.status_code, 200)

    def test_forgot_password_ok(self):
        payload = {
            "correo": "demo@rootblend.com"
        }
        response = self.client.post(
            self.forgot_password_url,
            data=json.dumps(payload),
            content_type="application/json"
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(RecuperacionPassword.objects.filter(usuario=self.usuario).exists())

    def test_reset_password_ok(self):
        token = RecuperacionPassword.objects.create(
            usuario=self.usuario,
            token="reset-token-demo",
            expiracion=timezone.now() + timedelta(minutes=30),
            usado=False
        )

        payload = {
            "token": token.token,
            "password_nueva": "Reset12345"
        }
        response = self.client.post(
            self.reset_password_url,
            data=json.dumps(payload),
            content_type="application/json"
        )

        self.assertEqual(response.status_code, 200)

        token.refresh_from_db()
        self.assertTrue(token.usado)