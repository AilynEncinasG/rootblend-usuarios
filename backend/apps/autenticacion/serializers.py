import json


class BaseJsonSerializer:
    required_fields = []

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

        for field in self.required_fields:
            value = payload.get(field)
            if value is None or (isinstance(value, str) and not value.strip()):
                self.errors[field] = [f"El campo {field} es obligatorio."]
            else:
                self.data[field] = value.strip() if isinstance(value, str) else value

        for key, value in payload.items():
            if key not in self.data:
                self.data[key] = value.strip() if isinstance(value, str) else value

        return len(self.errors) == 0


class RegisterSerializer(BaseJsonSerializer):
    required_fields = ["correo", "password"]


class LoginSerializer(BaseJsonSerializer):
    required_fields = ["correo", "password"]


class ChangePasswordSerializer(BaseJsonSerializer):
    required_fields = ["password_actual", "password_nueva"]


class ForgotPasswordSerializer(BaseJsonSerializer):
    required_fields = ["correo"]


class ResetPasswordSerializer(BaseJsonSerializer):
    required_fields = ["token", "password_nueva"]