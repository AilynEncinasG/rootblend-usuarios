from django.http import JsonResponse


def success_response(message="OK", data=None, status=200):
    return JsonResponse(
        {
            "success": True,
            "message": message,
            "data": data or {},
            "errors": {},
        },
        status=status,
    )


def error_response(message="Error", errors=None, status=400):
    return JsonResponse(
        {
            "success": False,
            "message": message,
            "data": {},
            "errors": errors or {},
        },
        status=status,
    )