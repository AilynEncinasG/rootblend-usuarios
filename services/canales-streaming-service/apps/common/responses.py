from django.http import JsonResponse


def success_response(data=None, message="OK", status=200):
    payload = {
        "success": True,
        "message": message,
    }

    if data is not None:
        payload["data"] = data

    return JsonResponse(payload, status=status, safe=False)


def error_response(message="Error", status=400, errors=None):
    payload = {
        "success": False,
        "message": message,
    }

    if errors is not None:
        payload["errors"] = errors

    return JsonResponse(payload, status=status)