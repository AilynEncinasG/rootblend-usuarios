import re


def validate_email_format(email):
    pattern = r"^[^\s@]+@[^\s@]+\.[^\s@]+$"
    return re.match(pattern, email) is not None


def validate_password_strength(password):
    errors = []

    if len(password) < 8:
        errors.append("La contraseña debe tener al menos 8 caracteres.")

    if not re.search(r"[A-Z]", password):
        errors.append("La contraseña debe incluir al menos una letra mayuscula.")

    if not re.search(r"[a-z]", password):
        errors.append("La contraseña debe incluir al menos una letra minuscula.")

    if not re.search(r"\d", password):
        errors.append("La contraseña debe incluir al menos un numero.")

    return errors