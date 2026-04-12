from apps.autenticacion.models import Sesion


def get_token_from_request(request):
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        return auth_header.replace("Bearer ", "").strip()

    return request.headers.get("X-Session-Token", "").strip()


def get_active_session(request):
    token = get_token_from_request(request)
    if not token:
        return None

    try:
        return Sesion.objects.select_related("usuario").get(
            token_sesion=token,
            activa=True,
        )
    except Sesion.DoesNotExist:
        return None


def get_authenticated_user(request):
    session = get_active_session(request)
    if not session:
        return None
    return session.usuario