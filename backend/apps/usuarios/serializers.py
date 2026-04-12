import json


class ProfileUpdateSerializer:
    allowed_fields = [
        "nombre_visible",
        "foto_perfil",
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

        return len(self.errors) == 0