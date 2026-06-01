from django.contrib import admin

from .models import (
    ChannelDonationRevenueStats,
    DonationRevenueEvent,
    ProcessedDonationEvent,
    StreamDonationRevenueStats,
)


@admin.register(ProcessedDonationEvent)
class ProcessedDonationEventAdmin(admin.ModelAdmin):
    list_display = ("event_id", "routing_key", "source", "processed_at")
    search_fields = ("event_id", "routing_key", "source")


@admin.register(DonationRevenueEvent)
class DonationRevenueEventAdmin(admin.ModelAdmin):
    list_display = (
        "id_revenue_event",
        "event_id",
        "id_stream",
        "id_canal",
        "nombre_viewer",
        "donation_type",
        "monto",
        "moneda",
        "processed_at",
    )
    search_fields = ("event_id", "nombre_viewer", "mensaje", "provider_reference")
    list_filter = ("donation_type", "moneda", "provider")


@admin.register(StreamDonationRevenueStats)
class StreamDonationRevenueStatsAdmin(admin.ModelAdmin):
    list_display = (
        "id_stream",
        "id_canal",
        "total_donations",
        "total_amount",
        "highest_donation_amount",
        "highest_donor_name",
        "updated_at",
    )
    search_fields = ("id_stream", "id_canal")


@admin.register(ChannelDonationRevenueStats)
class ChannelDonationRevenueStatsAdmin(admin.ModelAdmin):
    list_display = (
        "id_canal",
        "total_donations",
        "total_amount",
        "total_streams_with_donations",
        "highest_donation_amount",
        "highest_donor_name",
        "updated_at",
    )
    search_fields = ("id_canal",)