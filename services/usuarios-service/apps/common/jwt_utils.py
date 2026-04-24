import os
import uuid
import jwt
from datetime import datetime, timedelta, timezone


def _get_access_secret():
    return os.getenv("JWT_ACCESS_SECRET", "rootblend-access-secret")


def _get_refresh_secret():
    return os.getenv("JWT_REFRESH_SECRET", "rootblend-refresh-secret")


def _get_access_minutes():
    return int(os.getenv("JWT_ACCESS_MINUTES", "15"))


def _get_refresh_days():
    return int(os.getenv("JWT_REFRESH_DAYS", "7"))


def _utcnow():
    return datetime.now(timezone.utc)


def create_access_token(usuario):
    now = _utcnow()
    exp = now + timedelta(minutes=_get_access_minutes())

    payload = {
        "type": "access",
        "sub": str(usuario.id_usuario),
        "email": usuario.correo,
        "estado": usuario.estado,
        "iat": int(now.timestamp()),
        "exp": int(exp.timestamp()),
    }

    token = jwt.encode(payload, _get_access_secret(), algorithm="HS256")
    return token, exp


def create_refresh_token(usuario, session_id=None):
    now = _utcnow()
    exp = now + timedelta(days=_get_refresh_days())

    payload = {
        "type": "refresh",
        "sub": str(usuario.id_usuario),
        "sid": str(session_id) if session_id else None,
        "jti": str(uuid.uuid4()),
        "iat": int(now.timestamp()),
        "exp": int(exp.timestamp()),
    }

    token = jwt.encode(payload, _get_refresh_secret(), algorithm="HS256")
    return token, exp


def decode_access_token(token):
    return jwt.decode(token, _get_access_secret(), algorithms=["HS256"])


def decode_refresh_token(token):
    return jwt.decode(token, _get_refresh_secret(), algorithms=["HS256"])