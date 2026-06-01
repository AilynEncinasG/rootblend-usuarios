import json
from decimal import Decimal, InvalidOperation

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db.models import Count, Sum
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt

from .models import PaymentCreatorConfig, PaymentOrder, StreamDonation


def success_response(message, data=None, status=200):
    return JsonResponse(
        {
            "success": True,
            "message": message,
            "data": data or {},
        },
        status=status,
    )


def error_response(message, errors=None, status=400):
    return JsonResponse(
        {
            "success": False,
            "message": message,
            "errors": errors or {},
        },
        status=status,
    )


def money_to_float(value):
    if value is None:
        return 0.0

    return float(value)


def parse_json_body(request):
    try:
        return json.loads(request.body.decode("utf-8") or "{}")
    except json.JSONDecodeError:
        return None


def parse_decimal(value, field_name, errors):
    if value is None or value == "":
        errors[field_name] = ["Este campo es obligatorio."]
        return None

    try:
        parsed = Decimal(str(value)).quantize(Decimal("0.01"))
    except (InvalidOperation, ValueError, TypeError):
        errors[field_name] = ["Debe ser un monto numerico valido."]
        return None

    return parsed


def serialize_creator_config(config):
    return {
        "id_config": config.id_config,
        "id_canal": config.id_canal,
        "id_usuario_creador": config.id_usuario_creador,
        "provider": config.provider,
        "nombre_titular": config.nombre_titular,
        "banco": config.banco,
        "numero_cuenta": config.numero_cuenta,
        "telefono_pago": config.telefono_pago,
        "commerce_id": config.commerce_id,
        "flash_amount": money_to_float(config.flash_amount),
        "screen_amount": money_to_float(config.screen_amount),
        "epic_amount": money_to_float(config.epic_amount),
        "moneda": config.moneda,
        "activo": config.activo,
        "created_at": config.created_at.isoformat() if config.created_at else None,
        "updated_at": config.updated_at.isoformat() if config.updated_at else None,
    }


def serialize_public_donation_config(config):
    return {
        "id_canal": config.id_canal,
        "provider": config.provider,
        "flash_amount": money_to_float(config.flash_amount),
        "screen_amount": money_to_float(config.screen_amount),
        "epic_amount": money_to_float(config.epic_amount),
        "moneda": config.moneda,
        "activo": config.activo,
        "donation_types": [
            {
                "type": "flash",
                "label": "Donacion Flash",
                "amount": money_to_float(config.flash_amount),
                "description": "Mensaje destacado en el chat con animacion pequena.",
                "effect": "chat_highlight",
            },
            {
                "type": "screen",
                "label": "Donacion Pantalla",
                "amount": money_to_float(config.screen_amount),
                "description": "Mensaje animado sobre la pantalla del directo.",
                "effect": "screen_overlay",
            },
            {
                "type": "epic",
                "label": "Donacion Epica",
                "amount": money_to_float(config.epic_amount),
                "description": "Overlay grande con animacion, sonido, ranking y meta del stream.",
                "effect": "epic_overlay",
            },
        ],
    }


class HealthView(View):
    def get(self, request):
        return JsonResponse(
            {
                "status": "ok",
                "service": "pagos-service",
                "module": "payments",
                "provider": settings.PAYMENT_PROVIDER,
            },
            status=200,
        )


class VersionView(View):
    def get(self, request):
        return JsonResponse(
            {
                "success": True,
                "message": "ROOTBLEND pagos-service activo.",
                "data": {
                    "service": "pagos-service",
                    "version": "1.0.0",
                    "scope": "stream donations and QR payments",
                    "provider": settings.PAYMENT_PROVIDER,
                    "currency": settings.PAYMENT_CURRENCY,
                    "min_amount": settings.PAYMENT_MIN_AMOUNT,
                    "max_amount": settings.PAYMENT_MAX_AMOUNT,
                    "bcp_ready": bool(
                        settings.BCP_API_URL
                        and settings.BCP_CLIENT_ID
                        and settings.BCP_CLIENT_SECRET
                        and settings.BCP_COMMERCE_ID
                    ),
                },
            },
            status=200,
        )


class PaymentsSummaryView(View):
    def get(self, request):
        total_configs = PaymentCreatorConfig.objects.count()
        total_orders = PaymentOrder.objects.count()
        pending_orders = PaymentOrder.objects.filter(status="pending").count()
        paid_orders = PaymentOrder.objects.filter(status="paid").count()
        total_donations = StreamDonation.objects.count()

        donation_stats = StreamDonation.objects.aggregate(
            total_amount=Sum("monto"),
            total_count=Count("id_donation"),
        )

        return JsonResponse(
            {
                "success": True,
                "message": "Resumen de pagos obtenido correctamente.",
                "data": {
                    "creator_configs": total_configs,
                    "orders": {
                        "total": total_orders,
                        "pending": pending_orders,
                        "paid": paid_orders,
                    },
                    "donations": {
                        "total": total_donations,
                        "total_amount": money_to_float(
                            donation_stats.get("total_amount") or Decimal("0.00")
                        ),
                        "currency": settings.PAYMENT_CURRENCY,
                    },
                },
            },
            status=200,
        )


@method_decorator(csrf_exempt, name="dispatch")
class CreatorPaymentConfigView(View):
    def get(self, request):
        id_canal = request.GET.get("id_canal")

        if not id_canal:
            return error_response(
                message="Falta id_canal.",
                errors={"id_canal": ["Debes enviar id_canal en la URL."]},
                status=400,
            )

        try:
            config = PaymentCreatorConfig.objects.get(id_canal=int(id_canal))
        except ValueError:
            return error_response(
                message="id_canal invalido.",
                errors={"id_canal": ["Debe ser un numero entero."]},
                status=400,
            )
        except PaymentCreatorConfig.DoesNotExist:
            return error_response(
                message="El canal aun no tiene configuracion de pagos.",
                errors={"config": ["No existe configuracion para este canal."]},
                status=404,
            )

        return success_response(
            message="Configuracion de pagos obtenida correctamente.",
            data={"config": serialize_creator_config(config)},
            status=200,
        )

    def put(self, request):
        payload = parse_json_body(request)

        if payload is None:
            return error_response(
                message="JSON invalido.",
                errors={"body": ["El cuerpo de la solicitud debe ser JSON valido."]},
                status=400,
            )

        errors = {}

        id_canal = payload.get("id_canal")
        id_usuario_creador = payload.get("id_usuario_creador")

        try:
            id_canal = int(id_canal)
        except (TypeError, ValueError):
            errors["id_canal"] = ["Debe ser un numero entero."]

        try:
            id_usuario_creador = int(id_usuario_creador)
        except (TypeError, ValueError):
            errors["id_usuario_creador"] = ["Debe ser un numero entero."]

        provider = str(payload.get("provider") or settings.PAYMENT_PROVIDER or "mock").strip().lower()
        allowed_providers = {"mock", "bcp", "bnb", "libelula"}

        if provider not in allowed_providers:
            errors["provider"] = ["Proveedor invalido. Usa mock, bcp, bnb o libelula."]

        nombre_titular = str(payload.get("nombre_titular") or "").strip()
        banco = str(payload.get("banco") or "").strip()
        numero_cuenta = str(payload.get("numero_cuenta") or "").strip()
        telefono_pago = str(payload.get("telefono_pago") or "").strip()
        commerce_id = str(payload.get("commerce_id") or "").strip()

        if not nombre_titular:
            errors["nombre_titular"] = ["El nombre del titular es obligatorio."]

        flash_amount = parse_decimal(payload.get("flash_amount"), "flash_amount", errors)
        screen_amount = parse_decimal(payload.get("screen_amount"), "screen_amount", errors)
        epic_amount = parse_decimal(payload.get("epic_amount"), "epic_amount", errors)

        moneda = str(payload.get("moneda") or settings.PAYMENT_CURRENCY or "BOB").strip().upper()

        if moneda != "BOB":
            errors["moneda"] = ["Por ahora solo se permite BOB."]

        activo = bool(payload.get("activo", True))

        if errors:
            return error_response(
                message="Datos de configuracion de pagos invalidos.",
                errors=errors,
                status=400,
            )

        config, _created = PaymentCreatorConfig.objects.get_or_create(
            id_canal=id_canal,
            defaults={
                "id_usuario_creador": id_usuario_creador,
                "provider": provider,
                "nombre_titular": nombre_titular,
                "banco": banco or None,
                "numero_cuenta": numero_cuenta or None,
                "telefono_pago": telefono_pago or None,
                "commerce_id": commerce_id or None,
                "flash_amount": flash_amount,
                "screen_amount": screen_amount,
                "epic_amount": epic_amount,
                "moneda": moneda,
                "activo": activo,
            },
        )

        if not _created:
            config.id_usuario_creador = id_usuario_creador
            config.provider = provider
            config.nombre_titular = nombre_titular
            config.banco = banco or None
            config.numero_cuenta = numero_cuenta or None
            config.telefono_pago = telefono_pago or None
            config.commerce_id = commerce_id or None
            config.flash_amount = flash_amount
            config.screen_amount = screen_amount
            config.epic_amount = epic_amount
            config.moneda = moneda
            config.activo = activo

        try:
            config.full_clean()
        except ValidationError as validation_error:
            return error_response(
                message="La configuracion no cumple las reglas de montos.",
                errors=validation_error.message_dict,
                status=400,
            )

        config.save()

        return success_response(
            message=(
                "Configuracion de pagos creada correctamente."
                if _created
                else "Configuracion de pagos actualizada correctamente."
            ),
            data={"config": serialize_creator_config(config)},
            status=200 if not _created else 201,
        )


class PublicChannelDonationConfigView(View):
    def get(self, request, id_canal):
        try:
            config = PaymentCreatorConfig.objects.get(id_canal=id_canal, activo=True)
        except PaymentCreatorConfig.DoesNotExist:
            return error_response(
                message="El canal no tiene donaciones activas.",
                errors={"config": ["No existe configuracion activa para este canal."]},
                status=404,
            )

        return success_response(
            message="Configuracion publica de donaciones obtenida correctamente.",
            data={"config": serialize_public_donation_config(config)},
            status=200,
        )