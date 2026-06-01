import json


class ProfileUpdateSerializer:
    allowed_fields = [
        "nombre_visible",
        "foto_perfil",
        "banner_perfil",
        "biografia",
        "fecha_nacimiento",
    ]

    def __init__(self, body):
        self.body = body
        self.data = {}
        self.errors = {}

    def is_valid(self):
        try:
            payload = json.loads(self.body or "{}")
        except json.JSONDecodeError:
            self.errors["json"] = ["JSON invalido."]
            return False

        if not isinstance(payload, dict):
            self.errors["json"] = ["El cuerpo de la solicitud debe ser un objeto JSON."]
            return False

        for field in self.allowed_fields:
            if field in payload:
                value = payload[field]

                if isinstance(value, str):
                    value = value.strip()

                self.data[field] = value

        if "nombre_visible" in self.data and not self.data["nombre_visible"]:
            self.errors["nombre_visible"] = ["El nombre_visible no puede estar vacio."]

        if "foto_perfil" in self.data and self.data["foto_perfil"]:
            if not isinstance(self.data["foto_perfil"], str):
                self.errors["foto_perfil"] = ["La foto_perfil debe ser texto."]
            elif len(self.data["foto_perfil"]) > 1000:
                self.errors["foto_perfil"] = ["La URL de foto es demasiado larga."]

        if "banner_perfil" in self.data and self.data["banner_perfil"]:
            if not isinstance(self.data["banner_perfil"], str):
                self.errors["banner_perfil"] = ["El banner_perfil debe ser texto."]
            elif len(self.data["banner_perfil"]) > 1000:
                self.errors["banner_perfil"] = ["La URL del banner es demasiado larga."]

        if "biografia" in self.data and self.data["biografia"]:
            if not isinstance(self.data["biografia"], str):
                self.errors["biografia"] = ["La biografia debe ser texto."]
            elif len(self.data["biografia"]) > 250:
                self.errors["biografia"] = ["La biografia no puede superar 250 caracteres."]

        return len(self.errors) == 0