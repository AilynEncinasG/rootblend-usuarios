from decimal import Decimal

from django.http import JsonResponse
from django.views import View

from .models import ChannelDonationRevenueStats, StreamDonationRevenueStats


def money_to_float(value):
    if value is None:
        return 0.0

    if isinstance(value, Decimal):
        return float(value)

    return float(value)


def empty_stream_stats(id_stream):
    return {
        "id_stream": id_stream,
        "id_canal": None,
        "total_donations": 0,
        "total_amount": 0.0,
        "flash_count": 0,
        "flash_amount": 0.0,
        "screen_count": 0,
        "screen_amount": 0.0,
        "epic_count": 0,
        "epic_amount": 0.0,
        "highest_donation_amount": 0.0,
        "highest_donor_name": None,
        "last_donation_amount": 0.0,
        "last_donor_name": None,
        "last_donation_type": None,
        "last_donation_at": None,
    }


def serialize_stream_stats(stats):
    return {
        "id_stream": stats.id_stream,
        "id_canal": stats.id_canal,
        "total_donations": stats.total_donations,
        "total_amount": money_to_float(stats.total_amount),
        "flash_count": stats.flash_count,
        "flash_amount": money_to_float(stats.flash_amount),
        "screen_count": stats.screen_count,
        "screen_amount": money_to_float(stats.screen_amount),
        "epic_count": stats.epic_count,
        "epic_amount": money_to_float(stats.epic_amount),
        "highest_donation_amount": money_to_float(stats.highest_donation_amount),
        "highest_donor_name": stats.highest_donor_name,
        "last_donation_amount": money_to_float(stats.last_donation_amount),
        "last_donor_name": stats.last_donor_name,
        "last_donation_type": stats.last_donation_type,
        "last_donation_at": (
            stats.last_donation_at.isoformat() if stats.last_donation_at else None
        ),
        "updated_at": stats.updated_at.isoformat() if stats.updated_at else None,
    }


def empty_channel_stats(id_canal):
    return {
        "id_canal": id_canal,
        "total_donations": 0,
        "total_amount": 0.0,
        "total_streams_with_donations": 0,
        "highest_donation_amount": 0.0,
        "highest_donor_name": None,
        "last_donation_amount": 0.0,
        "last_donor_name": None,
        "last_donation_type": None,
        "last_donation_at": None,
    }


def serialize_channel_stats(stats):
    return {
        "id_canal": stats.id_canal,
        "total_donations": stats.total_donations,
        "total_amount": money_to_float(stats.total_amount),
        "total_streams_with_donations": stats.total_streams_with_donations,
        "highest_donation_amount": money_to_float(stats.highest_donation_amount),
        "highest_donor_name": stats.highest_donor_name,
        "last_donation_amount": money_to_float(stats.last_donation_amount),
        "last_donor_name": stats.last_donor_name,
        "last_donation_type": stats.last_donation_type,
        "last_donation_at": (
            stats.last_donation_at.isoformat() if stats.last_donation_at else None
        ),
        "updated_at": stats.updated_at.isoformat() if stats.updated_at else None,
    }


class DonationsHealthView(View):
    def get(self, request):
        return JsonResponse(
            {
                "success": True,
                "message": "Estadisticas de donaciones activas.",
                "data": {
                    "service": "estadisticas-service",
                    "module": "donations",
                    "consumer": "donation.paid",
                },
            },
            status=200,
        )


class StreamDonationStatsView(View):
    def get(self, request, id_stream):
        try:
            stats = StreamDonationRevenueStats.objects.get(id_stream=id_stream)
            data = serialize_stream_stats(stats)
        except StreamDonationRevenueStats.DoesNotExist:
            data = empty_stream_stats(id_stream)

        return JsonResponse(
            {
                "success": True,
                "message": "Estadisticas de donaciones del stream obtenidas correctamente.",
                "data": {
                    "stats": data,
                },
            },
            status=200,
        )


class ChannelDonationStatsView(View):
    def get(self, request, id_canal):
        try:
            stats = ChannelDonationRevenueStats.objects.get(id_canal=id_canal)
            data = serialize_channel_stats(stats)
        except ChannelDonationRevenueStats.DoesNotExist:
            data = empty_channel_stats(id_canal)

        return JsonResponse(
            {
                "success": True,
                "message": "Estadisticas de donaciones del canal obtenidas correctamente.",
                "data": {
                    "stats": data,
                },
            },
            status=200,
        )