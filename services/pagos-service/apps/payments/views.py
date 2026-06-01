import base64
import io
import json
from datetime import timedelta
from decimal import Decimal, InvalidOperation
from uuid import uuid4

import qrcode
from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import transaction
from django.db.models import Count, Sum
from django.http import JsonResponse
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt

from .models import DonationAlert, PaymentCreatorConfig, PaymentOrder, StreamDonation
from .rabbitmq import publish_event

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


def get_amount_for_donation_type(config, donation_type):
    if donation_type == "flash":
        return config.flash_amount

    if donation_type == "screen":
        return config.screen_amount

    if donation_type == "epic":
        return config.epic_amount

    return None


def get_animation_key(donation_type):
    if donation_type == "flash":
        return "chat_flash_highlight"

    if donation_type == "screen":
        return "screen_neon_message"

    if donation_type == "epic":
        return "epic_confetti_ranking"

    return "default_donation"


def generate_mock_qr_base64(payload):
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=4,
    )

    qr.add_data(payload)
    qr.make(fit=True)

    image = qr.make_image(fill_color="black", back_color="white")
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")

    encoded = base64.b64encode(buffer.getvalue()).decode("utf-8")

    return f"data:image/png;base64,{encoded}"


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


def serialize_order(order):
    return {
        "id_order": order.id_order,
        "id_stream": order.id_stream,
        "id_canal": order.id_canal,
        "id_usuario_viewer": order.id_usuario_viewer,
        "nombre_viewer": order.nombre_viewer,
        "order_type": order.order_type,
        "donation_type": order.donation_type,
        "monto": money_to_float(order.monto),
        "moneda": order.moneda,
        "mensaje": order.mensaje,
        "status": order.status,
        "provider": order.provider,
        "provider_reference": order.provider_reference,
        "qr_payload": order.qr_payload,
        "qr_image_base64": order.qr_image_base64,
        "qr_image_url": order.qr_image_url,
        "expires_at": order.expires_at.isoformat() if order.expires_at else None,
        "paid_at": order.paid_at.isoformat() if order.paid_at else None,
        "cancelled_at": (
            order.cancelled_at.isoformat() if order.cancelled_at else None
        ),
        "created_at": order.created_at.isoformat() if order.created_at else None,
        "updated_at": order.updated_at.isoformat() if order.updated_at else None,
    }


def serialize_donation(donation):
    return {
        "id_donation": donation.id_donation,
        "id_order": donation.order_id,
        "id_stream": donation.id_stream,
        "id_canal": donation.id_canal,
        "id_usuario_viewer": donation.id_usuario_viewer,
        "nombre_viewer": donation.nombre_viewer,
        "donation_type": donation.donation_type,
        "monto": money_to_float(donation.monto),
        "moneda": donation.moneda,
        "mensaje": donation.mensaje,
        "status": donation.status,
        "created_at": donation.created_at.isoformat() if donation.created_at else None,
    }

def build_donation_paid_event(order, donation, alert):
    return {
        "id_order": order.id_order,
        "id_donation": donation.id_donation,
        "id_alert": alert.id_alert,
        "id_stream": donation.id_stream,
        "id_canal": donation.id_canal,
        "id_usuario_viewer": donation.id_usuario_viewer,
        "nombre_viewer": donation.nombre_viewer,
        "donation_type": donation.donation_type,
        "monto": donation.monto,
        "moneda": donation.moneda,
        "mensaje": donation.mensaje,
        "provider": order.provider,
        "provider_reference": order.provider_reference,
        "paid_at": order.paid_at,
        "created_at": donation.created_at,
        "animation_key": alert.animation_key,
    }

def serialize_alert(alert):
    donation = getattr(alert, "donation", None)

    return {
        "id_alert": alert.id_alert,
        "id_donation": alert.donation_id,
        "id_stream": alert.id_stream,
        "id_canal": alert.id_canal,
        "alert_type": alert.alert_type,
        "title": alert.title,
        "message": alert.message,
        "animation_key": alert.animation_key,
        "shown": alert.shown,
        "created_at": alert.created_at.isoformat() if alert.created_at else None,
        "shown_at": alert.shown_at.isoformat() if alert.shown_at else None,
        "donation": serialize_donation(donation) if donation else None,
    }


def create_confirmed_donation_from_order(order):
    donation, _created = StreamDonation.objects.get_or_create(
        order=order,
        defaults={
            "id_stream": order.id_stream,
            "id_canal": order.id_canal,
            "id_usuario_viewer": order.id_usuario_viewer,
            "nombre_viewer": order.nombre_viewer,
            "donation_type": order.donation_type,
            "monto": order.monto,
            "moneda": order.moneda,
            "mensaje": order.mensaje,
            "status": "confirmed",
        },
    )

    title_by_type = {
        "flash": "Donacion Flash",
        "screen": "Donacion en Pantalla",
        "epic": "Donacion Epica",
    }

    alert, _alert_created = DonationAlert.objects.get_or_create(
        donation=donation,
        defaults={
            "id_stream": donation.id_stream,
            "id_canal": donation.id_canal,
            "alert_type": donation.donation_type,
            "title": f"{title_by_type.get(donation.donation_type, 'Donacion')} de {donation.nombre_viewer or 'Viewer'}",
            "message": donation.mensaje or "Gracias por apoyar el stream.",
            "animation_key": get_animation_key(donation.donation_type),
            "shown": False,
        },
    )

    return donation, alert


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

        provider = str(
            payload.get("provider") or settings.PAYMENT_PROVIDER or "mock"
        ).strip().lower()
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


@method_decorator(csrf_exempt, name="dispatch")
class CreateDonationOrderView(View):
    def post(self, request, id_stream):
        payload = parse_json_body(request)

        if payload is None:
            return error_response(
                message="JSON invalido.",
                errors={"body": ["El cuerpo de la solicitud debe ser JSON valido."]},
                status=400,
            )

        errors = {}

        try:
            id_canal = int(payload.get("id_canal"))
        except (TypeError, ValueError):
            errors["id_canal"] = ["Debe ser un numero entero."]
            id_canal = None

        id_usuario_viewer = payload.get("id_usuario_viewer")

        if id_usuario_viewer in ("", None):
            id_usuario_viewer = None
        else:
            try:
                id_usuario_viewer = int(id_usuario_viewer)
            except (TypeError, ValueError):
                errors["id_usuario_viewer"] = ["Debe ser un numero entero."]
                id_usuario_viewer = None

        nombre_viewer = str(payload.get("nombre_viewer") or "Viewer").strip()[:120]
        donation_type = str(payload.get("donation_type") or "").strip().lower()
        mensaje = str(payload.get("mensaje") or "").strip()[:180]

        if donation_type not in {"flash", "screen", "epic"}:
            errors["donation_type"] = ["Usa flash, screen o epic."]

        if not mensaje:
            errors["mensaje"] = ["El mensaje de donacion es obligatorio."]

        if errors:
            return error_response(
                message="Datos de donacion invalidos.",
                errors=errors,
                status=400,
            )

        try:
            config = PaymentCreatorConfig.objects.get(id_canal=id_canal, activo=True)
        except PaymentCreatorConfig.DoesNotExist:
            return error_response(
                message="El canal no tiene pagos activos.",
                errors={"config": ["Configura pagos del streamer primero."]},
                status=404,
            )

        monto = get_amount_for_donation_type(config, donation_type)

        if monto is None:
            return error_response(
                message="Tipo de donacion invalido.",
                errors={"donation_type": ["No se pudo calcular el monto."]},
                status=400,
            )

        provider_reference = f"RB-{id_stream}-{id_canal}-{uuid4().hex[:16].upper()}"
        expires_at = timezone.now() + timedelta(minutes=5)

        qr_payload = (
            f"ROOTBLEND-MOCK-QR|ref={provider_reference}|"
            f"stream={id_stream}|canal={id_canal}|"
            f"type={donation_type}|amount={monto}|currency={config.moneda}"
        )

        qr_image_base64 = generate_mock_qr_base64(qr_payload)

        order = PaymentOrder.objects.create(
            id_stream=id_stream,
            id_canal=id_canal,
            id_usuario_viewer=id_usuario_viewer,
            nombre_viewer=nombre_viewer,
            order_type="donation",
            donation_type=donation_type,
            monto=monto,
            moneda=config.moneda,
            mensaje=mensaje,
            status="pending",
            provider=config.provider or settings.PAYMENT_PROVIDER,
            provider_reference=provider_reference,
            qr_payload=qr_payload,
            qr_image_base64=qr_image_base64,
            qr_image_url=None,
            expires_at=expires_at,
        )

        return success_response(
            message="Orden de donacion creada correctamente.",
            data={
                "order": serialize_order(order),
                "payment_instructions": {
                    "title": "Escanea el QR para completar la donacion",
                    "description": "Modo mock: este QR representa el pago QR real. Usa simulate-paid para confirmar.",
                    "expires_in_seconds": 300,
                },
            },
            status=201,
        )


class PaymentOrderStatusView(View):
    def get(self, request, id_order):
        try:
            order = PaymentOrder.objects.get(id_order=id_order)
        except PaymentOrder.DoesNotExist:
            return error_response(
                message="Orden no encontrada.",
                errors={"id_order": ["No existe una orden con ese id."]},
                status=404,
            )

        donation = getattr(order, "donation", None)
        alert = getattr(donation, "alert", None) if donation else None

        return success_response(
            message="Estado de orden obtenido correctamente.",
            data={
                "order": serialize_order(order),
                "donation": serialize_donation(donation) if donation else None,
                "alert": serialize_alert(alert) if alert else None,
            },
            status=200,
        )


@method_decorator(csrf_exempt, name="dispatch")
class SimulatePaidOrderView(View):
    def post(self, request, id_order):
        try:
            order = PaymentOrder.objects.get(id_order=id_order)
        except PaymentOrder.DoesNotExist:
            return error_response(
                message="Orden no encontrada.",
                errors={"id_order": ["No existe una orden con ese id."]},
                status=404,
            )

        if order.status == "paid":
            donation = getattr(order, "donation", None)
            alert = getattr(donation, "alert", None) if donation else None

            return success_response(
                message="La orden ya estaba pagada.",
                data={
                    "order": serialize_order(order),
                    "donation": serialize_donation(donation) if donation else None,
                    "alert": serialize_alert(alert) if alert else None,
                },
                status=200,
            )

        if order.status != "pending":
            return error_response(
                message="La orden no puede confirmarse.",
                errors={"status": [f"Estado actual: {order.status}."]},
                status=400,
            )

        if order.expires_at and timezone.now() > order.expires_at:
            order.status = "expired"
            order.save(update_fields=["status", "updated_at"])

            return error_response(
                message="La orden expiro.",
                errors={"expires_at": ["Genera un nuevo QR."]},
                status=400,
            )

        with transaction.atomic():
            order.mark_paid()
            donation, alert = create_confirmed_donation_from_order(order)

        event_published = publish_event(
            "donation.paid",
            build_donation_paid_event(order, donation, alert),
        )

        return success_response(
            message="Pago mock confirmado correctamente.",
            data={
                "order": serialize_order(order),
                "donation": serialize_donation(donation),
                "alert": serialize_alert(alert),
                "event": {
                    "routing_key": "donation.paid",
                    "published": event_published,
                    "exchange": settings.RABBITMQ_EXCHANGE,
                },
            },
            status=200,
        )


class StreamDonationAlertsView(View):
    def get(self, request, id_stream):
        limit = request.GET.get("limit", "10")
        only_unshown = request.GET.get("only_unshown", "0") in ("1", "true", "yes")

        try:
            limit = int(limit)
        except ValueError:
            limit = 10

        limit = max(1, min(limit, 50))

        alerts = DonationAlert.objects.filter(id_stream=id_stream)

        if only_unshown:
            alerts = alerts.filter(shown=False)

        alerts = alerts.order_by("created_at" if only_unshown else "-created_at")[:limit]

        return success_response(
            message="Alertas de donacion obtenidas correctamente.",
            data={
                "alerts": [serialize_alert(alert) for alert in alerts],
            },
            status=200,
        )


@method_decorator(csrf_exempt, name="dispatch")
class MarkDonationAlertShownView(View):
    def post(self, request, id_alert):
        try:
            alert = DonationAlert.objects.get(id_alert=id_alert)
        except DonationAlert.DoesNotExist:
            return error_response(
                message="Alerta no encontrada.",
                errors={"id_alert": ["No existe una alerta con ese id."]},
                status=404,
            )

        if not alert.shown:
            alert.mark_shown()

        return success_response(
            message="Alerta marcada como mostrada.",
            data={"alert": serialize_alert(alert)},
            status=200,
        )