from decimal import Decimal

from django.db import models
from django.utils import timezone


class ProcessedDonationEvent(models.Model):
    event_id = models.CharField(max_length=120, primary_key=True)
    routing_key = models.CharField(max_length=120)
    source = models.CharField(max_length=80, default="pagos-service")
    processed_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "processed_donation_events"
        ordering = ["-processed_at"]

    def __str__(self):
        return f"{self.routing_key} - {self.event_id}"


class DonationRevenueEvent(models.Model):
    id_revenue_event = models.BigAutoField(primary_key=True)

    event_id = models.CharField(max_length=120, unique=True)
    id_order = models.BigIntegerField()
    id_donation = models.BigIntegerField()
    id_alert = models.BigIntegerField(null=True, blank=True)

    id_stream = models.IntegerField()
    id_canal = models.IntegerField()
    id_usuario_viewer = models.IntegerField(null=True, blank=True)

    nombre_viewer = models.CharField(max_length=120, blank=True, null=True)
    donation_type = models.CharField(max_length=30)
    monto = models.DecimalField(max_digits=12, decimal_places=2)
    moneda = models.CharField(max_length=10, default="BOB")
    mensaje = models.CharField(max_length=220, blank=True, null=True)

    provider = models.CharField(max_length=30, default="mock")
    provider_reference = models.CharField(max_length=150, blank=True, null=True)
    animation_key = models.CharField(max_length=80, blank=True, null=True)

    paid_at = models.DateTimeField(null=True, blank=True)
    occurred_at = models.DateTimeField(null=True, blank=True)
    processed_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "donation_revenue_events"
        ordering = ["-processed_at"]
        indexes = [
            models.Index(fields=["id_stream", "processed_at"]),
            models.Index(fields=["id_canal", "processed_at"]),
            models.Index(fields=["donation_type"]),
        ]

    def __str__(self):
        return f"Donation {self.id_donation} - {self.monto} {self.moneda}"


class StreamDonationRevenueStats(models.Model):
    id_stat = models.BigAutoField(primary_key=True)

    id_stream = models.IntegerField(unique=True)
    id_canal = models.IntegerField()

    total_donations = models.PositiveIntegerField(default=0)
    total_amount = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        default=Decimal("0.00"),
    )

    flash_count = models.PositiveIntegerField(default=0)
    flash_amount = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        default=Decimal("0.00"),
    )

    screen_count = models.PositiveIntegerField(default=0)
    screen_amount = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        default=Decimal("0.00"),
    )

    epic_count = models.PositiveIntegerField(default=0)
    epic_amount = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        default=Decimal("0.00"),
    )

    highest_donation_amount = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        default=Decimal("0.00"),
    )
    highest_donor_name = models.CharField(max_length=120, blank=True, null=True)

    last_donation_amount = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        default=Decimal("0.00"),
    )
    last_donor_name = models.CharField(max_length=120, blank=True, null=True)
    last_donation_type = models.CharField(max_length=30, blank=True, null=True)
    last_donation_at = models.DateTimeField(null=True, blank=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "stream_donation_revenue_stats"
        ordering = ["-total_amount"]

    def __str__(self):
        return f"Stream {self.id_stream} - {self.total_amount} BOB"


class ChannelDonationRevenueStats(models.Model):
    id_stat = models.BigAutoField(primary_key=True)

    id_canal = models.IntegerField(unique=True)

    total_donations = models.PositiveIntegerField(default=0)
    total_amount = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        default=Decimal("0.00"),
    )

    total_streams_with_donations = models.PositiveIntegerField(default=0)

    highest_donation_amount = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        default=Decimal("0.00"),
    )
    highest_donor_name = models.CharField(max_length=120, blank=True, null=True)

    last_donation_amount = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        default=Decimal("0.00"),
    )
    last_donor_name = models.CharField(max_length=120, blank=True, null=True)
    last_donation_type = models.CharField(max_length=30, blank=True, null=True)
    last_donation_at = models.DateTimeField(null=True, blank=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "channel_donation_revenue_stats"
        ordering = ["-total_amount"]

    def __str__(self):
        return f"Canal {self.id_canal} - {self.total_amount} BOB"