from django.contrib import admin

from .models import (
    DonationAlert,
    PaymentCreatorConfig,
    PaymentOrder,
    StreamDonation,
)


@admin.register(PaymentCreatorConfig)
class PaymentCreatorConfigAdmin(admin.ModelAdmin):
    list_display = (
        "id_config",
        "id_canal",
        "id_usuario_creador",
        "provider",
        "flash_amount",
        "screen_amount",
        "epic_amount",
        "moneda",
        "activo",
        "updated_at",
    )
    search_fields = ("id_canal", "id_usuario_creador", "nombre_titular", "banco")
    list_filter = ("provider", "activo", "moneda")


@admin.register(PaymentOrder)
class PaymentOrderAdmin(admin.ModelAdmin):
    list_display = (
        "id_order",
        "id_stream",
        "id_canal",
        "donation_type",
        "monto",
        "moneda",
        "status",
        "provider",
        "created_at",
        "paid_at",
    )
    search_fields = (
        "provider_reference",
        "nombre_viewer",
        "mensaje",
    )
    list_filter = ("status", "provider", "donation_type", "moneda")
    readonly_fields = ("provider_reference", "created_at", "updated_at")


@admin.register(StreamDonation)
class StreamDonationAdmin(admin.ModelAdmin):
    list_display = (
        "id_donation",
        "id_stream",
        "id_canal",
        "nombre_viewer",
        "donation_type",
        "monto",
        "moneda",
        "status",
        "created_at",
    )
    search_fields = ("nombre_viewer", "mensaje")
    list_filter = ("donation_type", "status", "moneda")


@admin.register(DonationAlert)
class DonationAlertAdmin(admin.ModelAdmin):
    list_display = (
        "id_alert",
        "id_stream",
        "id_canal",
        "alert_type",
        "animation_key",
        "shown",
        "created_at",
        "shown_at",
    )
    search_fields = ("title", "message")
    list_filter = ("alert_type", "shown")