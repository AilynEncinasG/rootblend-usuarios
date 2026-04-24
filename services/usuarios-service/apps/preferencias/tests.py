import json
from django.test import TestCase, Client

from apps.usuarios.models import Usuario
from apps.autenticacion.models import Sesion
from apps.preferencias.models import PreferenciaUsuario


class PreferenciasTests(TestCase):
    def setUp(self):
        self.client = Client()

        self.usuario = Usuario.objects.create(
            correo="pref@rootblend.com",
            estado="activo"
        )

        self.preferencia = PreferenciaUsuario.objects.create(
            usuario=self.usuario,
            idioma="es",
            tema="claro",
            autoplay=True,
            recibir_notificaciones=True
        )

        self.sesion = Sesion.objects.create(
            usuario=self.usuario,
            token_sesion="token-preferencias-test",
            activa=True
        )

        self.me_url = "/api/preferences/me/"
        self.update_url = "/api/preferences/me/update/"

    def auth_headers(self):
        return {
            "HTTP_AUTHORIZATION": f"Bearer {self.sesion.token_sesion}"
        }

    def test_preferences_without_token(self):
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, 401)

    def test_preferences_me_ok(self):
        response = self.client.get(self.me_url, **self.auth_headers())
        self.assertEqual(response.status_code, 200)

    def test_preferences_update_ok(self):
        payload = {
            "idioma": "en",
            "tema": "oscuro",
            "autoplay": False,
            "recibir_notificaciones": False
        }

        response = self.client.put(
            self.update_url,
            data=json.dumps(payload),
            content_type="application/json",
            **self.auth_headers()
        )

        self.assertEqual(response.status_code, 200)

        self.preferencia.refresh_from_db()
        self.assertEqual(self.preferencia.idioma, "en")
        self.assertEqual(self.preferencia.tema, "oscuro")
        self.assertFalse(self.preferencia.autoplay)
        self.assertFalse(self.preferencia.recibir_notificaciones)

    def test_preferences_invalid_values(self):
        payload = {
            "idioma": "",
            "tema": "valor-raro"
        }

        response = self.client.put(
            self.update_url,
            data=json.dumps(payload),
            content_type="application/json",
            **self.auth_headers()
        )

        self.assertEqual(response.status_code, 400)