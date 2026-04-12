import json
from django.test import TestCase, Client

from apps.usuarios.models import Usuario, PerfilUsuario
from apps.autenticacion.models import Sesion


class UsuariosTests(TestCase):
    def setUp(self):
        self.client = Client()

        self.usuario = Usuario.objects.create(
            correo="perfil@rootblend.com",
            estado="activo"
        )

        self.perfil = PerfilUsuario.objects.create(
            usuario=self.usuario,
            nombre_visible="Perfil Demo",
            biografia="Bio demo"
        )

        self.sesion = Sesion.objects.create(
            usuario=self.usuario,
            token_sesion="token-usuarios-test",
            activa=True
        )

        self.me_url = "/api/users/me/"
        self.profile_url = "/api/users/me/profile/"

    def auth_headers(self):
        return {
            "HTTP_AUTHORIZATION": f"Bearer {self.sesion.token_sesion}"
        }

    def test_me_without_token(self):
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, 401)

    def test_me_with_token(self):
        response = self.client.get(self.me_url, **self.auth_headers())
        self.assertEqual(response.status_code, 200)

    def test_update_profile_ok(self):
        payload = {
            "nombre_visible": "Nuevo Nombre",
            "biografia": "Nueva biografia",
            "fecha_nacimiento": "2000-01-01"
        }

        response = self.client.put(
            self.profile_url,
            data=json.dumps(payload),
            content_type="application/json",
            **self.auth_headers()
        )

        self.assertEqual(response.status_code, 200)

        self.perfil.refresh_from_db()
        self.assertEqual(self.perfil.nombre_visible, "Nuevo Nombre")

    def test_update_profile_invalid_date(self):
        payload = {
            "fecha_nacimiento": "fecha-invalida"
        }

        response = self.client.put(
            self.profile_url,
            data=json.dumps(payload),
            content_type="application/json",
            **self.auth_headers()
        )

        self.assertEqual(response.status_code, 400)

    def test_profile_created_if_missing(self):
        self.perfil.delete()

        payload = {
            "nombre_visible": "Creado Automaticamente"
        }

        response = self.client.put(
            self.profile_url,
            data=json.dumps(payload),
            content_type="application/json",
            **self.auth_headers()
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(PerfilUsuario.objects.filter(usuario=self.usuario).exists())