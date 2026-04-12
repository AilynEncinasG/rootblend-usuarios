import hashlib
import secrets
from django.db import transaction
from django.utils import timezone

from apps.usuarios.models import Usuario, PerfilUsuario
from apps.preferencias.models import PreferenciaUsuario
from apps.autenticacion.models import Credencial, Sesion
from .validators import validate_email_format, validate_password_strength


def generate_salt():
    return secrets.token_hex(16)


def hash_password(password, salt):
    return hashlib.sha256(f"{password}{salt}".encode("utf-8")).hexdigest()


def generate_session_token():
    return secrets.token_urlsafe(32)


def register_user(correo, password):
    errors = {}

    correo = correo.lower().strip()

    if not validate_email_format(correo):
        errors["correo"] = ["El correo no tiene un formato valido."]

    password_errors = validate_password_strength(password)
    if password_errors:
        errors["password"] = password_errors

    if Usuario.objects.filter(correo=correo).exists():
        errors["correo"] = ["Este correo ya esta registrado."]

    if errors:
        return None, errors

    with transaction.atomic():
        usuario = Usuario.objects.create(
            correo=correo,
            estado="activo",
            ultimo_acceso=timezone.now(),
        )

        PerfilUsuario.objects.create(
            usuario=usuario,
            nombre_visible=correo.split("@")[0],
        )

        PreferenciaUsuario.objects.create(
            usuario=usuario
        )

        salt = generate_salt()
        password_hash = hash_password(password, salt)

        Credencial.objects.create(
            usuario=usuario,
            password_hash=password_hash,
            password_salt=salt,
            intentos_fallidos=0,
        )

    return usuario, {}


def login_user(correo, password, ip=None):
    errors = {}
    correo = correo.lower().strip()

    try:
        usuario = Usuario.objects.get(correo=correo)
    except Usuario.DoesNotExist:
        return None, None, {"credenciales": ["Correo o contraseña incorrectos."]}

    try:
        credencial = Credencial.objects.get(usuario=usuario)
    except Credencial.DoesNotExist:
        return None, None, {"credenciales": ["La cuenta no tiene credenciales configuradas."]}

    password_hash = hash_password(password, credencial.password_salt)

    if password_hash != credencial.password_hash:
        credencial.intentos_fallidos += 1
        credencial.save(update_fields=["intentos_fallidos"])
        return None, None, {"credenciales": ["Correo o contraseña incorrectos."]}

    credencial.intentos_fallidos = 0
    credencial.save(update_fields=["intentos_fallidos"])

    usuario.ultimo_acceso = timezone.now()
    usuario.save(update_fields=["ultimo_acceso"])

    token = generate_session_token()
    sesion = Sesion.objects.create(
        usuario=usuario,
        token_sesion=token,
        ip=ip,
        activa=True,
    )

    return usuario, sesion, errors


def logout_user(token):
    if not token:
        return False

    try:
        sesion = Sesion.objects.get(token_sesion=token, activa=True)
    except Sesion.DoesNotExist:
        return False

    sesion.activa = False
    sesion.fin = timezone.now()
    sesion.save(update_fields=["activa", "fin"])
    return True


def change_user_password(usuario, password_actual, password_nueva):
    try:
        credencial = Credencial.objects.get(usuario=usuario)
    except Credencial.DoesNotExist:
        return {"credencial": ["No se encontraron credenciales para este usuario."]}

    actual_hash = hash_password(password_actual, credencial.password_salt)
    if actual_hash != credencial.password_hash:
        return {"password_actual": ["La contraseña actual es incorrecta."]}

    if password_actual == password_nueva:
        return {"password_nueva": ["La nueva contraseña no puede ser igual a la actual."]}

    password_errors = validate_password_strength(password_nueva)
    if password_errors:
        return {"password_nueva": password_errors}

    new_salt = generate_salt()
    new_hash = hash_password(password_nueva, new_salt)

    credencial.password_salt = new_salt
    credencial.password_hash = new_hash
    credencial.fecha_actualizacion = timezone.now()
    credencial.save(update_fields=["password_salt", "password_hash", "fecha_actualizacion"])

    return {}