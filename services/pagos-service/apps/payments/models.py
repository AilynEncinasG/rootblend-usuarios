from decimal import Decimal

from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone


class PaymentCreatorConfig(models.Model):
    PROVIDER_CHOICES = [
        ("mock", "Mock"),
        ("bcp", "BCP"),
        ("bnb", "BNB"),
        ("libelula", "Libelula"),
    ]

    id_config = models.BigAutoField(primary_key=True)
    id_canal = models.IntegerField(unique=True)
    id_usuario_creador = models.IntegerField()

    provider = models.CharField(
        max_length=30,
        choices=PROVIDER_CHOICES,
        default="mock",
    )

    nombre_titular = models.CharField(max_length=150)
    banco = models.CharField(max_length=100, blank=True, null=True)
    numero_cuenta = models.CharField(max_length=100, blank=True, null=True)
    telefono_pago = models.CharField(max_length=30, blank=True, null=True)
    commerce_id = models.CharField(max_length=150, blank=True, null=True)

    flash_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("5.00"),
    )
    screen_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("8.00"),
    )
    epic_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("20.00"),
    )

    moneda = models.CharField(max_length=10, default="BOB")
    activo = models.BooleanField(default=True)

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "payment_creator_configs"
        ordering = ["-updated_at"]

    def clean(self):
        if self.flash_amount < Decimal("1.00") or self.flash_amount > Decimal("5.00"):
            raise ValidationError(
                {"flash_amount": "La donacion flash debe estar entre 1 y 5 Bs."}
            )

        if self.screen_amount < Decimal("6.00") or self.screen_amount > Decimal("10.00"):
            raise ValidationError(
                {"screen_amount": "La donacion pantalla debe estar entre 6 y 10 Bs."}
            )

        if self.epic_amount < Decimal("11.00") or self.epic_amount > Decimal("150.00"):
            raise ValidationError(
                {"epic_amount": "La donacion epica debe estar entre 11 y 150 Bs."}
            )

    def __str__(self):
        return f"Pagos canal {self.id_canal} - {self.provider}"


class PaymentOrder(models.Model):
    ORDER_TYPE_CHOICES = [
        ("donation", "Donation"),
    ]

    DONATION_TYPE_CHOICES = [
        ("flash", "Flash"),
        ("screen", "Screen"),
        ("epic", "Epic"),
    ]

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("cancelled", "Cancelled"),
        ("expired", "Expired"),
        ("failed", "Failed"),
    ]

    id_order = models.BigAutoField(primary_key=True)

    id_stream = models.IntegerField()
    id_canal = models.IntegerField()
    id_usuario_viewer = models.IntegerField(null=True, blank=True)
    nombre_viewer = models.CharField(max_length=120, blank=True, null=True)

    order_type = models.CharField(
        max_length=30,
        choices=ORDER_TYPE_CHOICES,
        default="donation",
    )
    donation_type = models.CharField(
        max_length=30,
        choices=DONATION_TYPE_CHOICES,
    )

    monto = models.DecimalField(max_digits=10, decimal_places=2)
    moneda = models.CharField(max_length=10, default="BOB")
    mensaje = models.CharField(max_length=180, blank=True, null=True)

    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default="pending",
    )

    provider = models.CharField(max_length=30, default="mock")
    provider_reference = models.CharField(max_length=150, unique=True)

    qr_payload = models.TextField(blank=True, null=True)
    qr_image_base64 = models.TextField(blank=True, null=True)
    qr_image_url = models.TextField(blank=True, null=True)

    expires_at = models.DateTimeField()
    paid_at = models.DateTimeField(blank=True, null=True)
    cancelled_at = models.DateTimeField(blank=True, null=True)

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "payment_orders"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["id_stream", "status"]),
            models.Index(fields=["id_canal", "status"]),
            models.Index(fields=["provider_reference"]),
        ]

    @property
    def is_pending(self):
        return self.status == "pending"

    @property
    def is_paid(self):
        return self.status == "paid"

    def mark_paid(self):
        self.status = "paid"
        self.paid_at = timezone.now()
        self.save(update_fields=["status", "paid_at", "updated_at"])

    def mark_cancelled(self):
        self.status = "cancelled"
        self.cancelled_at = timezone.now()
        self.save(update_fields=["status", "cancelled_at", "updated_at"])

    def __str__(self):
        return f"Orden {self.id_order} - {self.monto} {self.moneda} - {self.status}"


class StreamDonation(models.Model):
    DONATION_TYPE_CHOICES = [
        ("flash", "Flash"),
        ("screen", "Screen"),
        ("epic", "Epic"),
    ]

    STATUS_CHOICES = [
        ("confirmed", "Confirmed"),
        ("hidden", "Hidden"),
    ]

    id_donation = models.BigAutoField(primary_key=True)

    order = models.OneToOneField(
        PaymentOrder,
        on_delete=models.CASCADE,
        related_name="donation",
    )

    id_stream = models.IntegerField()
    id_canal = models.IntegerField()
    id_usuario_viewer = models.IntegerField(null=True, blank=True)
    nombre_viewer = models.CharField(max_length=120, blank=True, null=True)

    donation_type = models.CharField(
        max_length=30,
        choices=DONATION_TYPE_CHOICES,
    )
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    moneda = models.CharField(max_length=10, default="BOB")
    mensaje = models.CharField(max_length=180, blank=True, null=True)

    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default="confirmed",
    )

    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "stream_donations"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["id_stream", "created_at"]),
            models.Index(fields=["id_canal", "created_at"]),
        ]

    def __str__(self):
        return f"Donacion {self.id_donation} - {self.monto} {self.moneda}"


class DonationAlert(models.Model):
    ALERT_TYPE_CHOICES = [
        ("flash", "Flash"),
        ("screen", "Screen"),
        ("epic", "Epic"),
    ]

    id_alert = models.BigAutoField(primary_key=True)

    donation = models.OneToOneField(
        StreamDonation,
        on_delete=models.CASCADE,
        related_name="alert",
    )

    id_stream = models.IntegerField()
    id_canal = models.IntegerField()

    alert_type = models.CharField(
        max_length=30,
        choices=ALERT_TYPE_CHOICES,
    )

    title = models.CharField(max_length=150)
    message = models.CharField(max_length=220, blank=True, null=True)
    animation_key = models.CharField(max_length=80)
    shown = models.BooleanField(default=False)

    created_at = models.DateTimeField(default=timezone.now)
    shown_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = "donation_alerts"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["id_stream", "shown"]),
            models.Index(fields=["id_canal", "shown"]),
        ]

    def mark_shown(self):
        self.shown = True
        self.shown_at = timezone.now()
        self.save(update_fields=["shown", "shown_at"])

    def __str__(self):
        return f"Alerta {self.id_alert} - {self.alert_type}"