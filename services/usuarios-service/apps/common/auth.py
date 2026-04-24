from apps.usuarios.models import Usuario
from apps.common.jwt_utils import decode_access_token


def get_token_from_request(request):
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        return auth_header.replace("Bearer ", "").strip()
    return ""


def get_authenticated_user(request):
    token = get_token_from_request(request)
    if not token:
        return None

    try:
        payload = decode_access_token(token)
    except Exception:
        return None

    user_id = payload.get("sub")
    if not user_id:
        return None

    try:
        return Usuario.objects.get(id_usuario=user_id, estado="activo")
    except Usuario.DoesNotExist:
        return None