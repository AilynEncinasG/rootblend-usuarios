import json


class PreferenceUpdateSerializer:
    allowed_fields = [
        "idioma",
        "tema",
        "autoplay",
        "recibir_notificaciones",
    ]

    valid_temas = ["claro", "oscuro"]
    valid_idiomas = ["es", "en"]

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
                self.data[field] = payload[field]

        if "tema" in self.data and self.data["tema"] not in self.valid_temas:
            self.errors["tema"] = [f"El tema debe ser uno de estos valores: {', '.join(self.valid_temas)}."]

        if "idioma" in self.data and self.data["idioma"] not in self.valid_idiomas:
            self.errors["idioma"] = [f"El idioma debe ser uno de estos valores: {', '.join(self.valid_idiomas)}."]

        if "autoplay" in self.data and not isinstance(self.data["autoplay"], bool):
            self.errors["autoplay"] = ["El campo autoplay debe ser booleano."]

        if "recibir_notificaciones" in self.data and not isinstance(self.data["recibir_notificaciones"], bool):
            self.errors["recibir_notificaciones"] = ["El campo recibir_notificaciones debe ser booleano."]

        return len(self.errors) == 0