import os
import jwt


def get_bearer_token(request):
    auth_header = request.headers.get("Authorization", "")

    if not auth_header.startswith("Bearer "):
        return None

    return auth_header.replace("Bearer ", "").strip()


def get_current_user_id(request):
    token = get_bearer_token(request)

    if not token:
        return None

    secret = os.getenv("JWT_ACCESS_SECRET", "rootblend-access-secret")

    try:
        payload = jwt.decode(token, secret, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

    return payload.get("id_usuario") or payload.get("user_id") or payload.get("sub")