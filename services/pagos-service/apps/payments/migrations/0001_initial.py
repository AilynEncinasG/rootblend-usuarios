# Generated manually for ROOT BLEND local Docker demo.
from decimal import Decimal

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="PaymentCreatorConfig",
            fields=[
                ("id_config", models.BigAutoField(primary_key=True, serialize=False)),
                ("id_canal", models.IntegerField(unique=True)),
                ("id_usuario_creador", models.IntegerField()),
                ("provider", models.CharField(choices=[("mock", "Mock"), ("bcp", "BCP"), ("bnb", "BNB"), ("libelula", "Libelula")], default="mock", max_length=30)),
                ("nombre_titular", models.CharField(max_length=150)),
                ("banco", models.CharField(blank=True, max_length=100, null=True)),
                ("numero_cuenta", models.CharField(blank=True, max_length=100, null=True)),
                ("telefono_pago", models.CharField(blank=True, max_length=30, null=True)),
                ("commerce_id", models.CharField(blank=True, max_length=150, null=True)),
                ("flash_amount", models.DecimalField(decimal_places=2, default=Decimal("5.00"), max_digits=10)),
                ("screen_amount", models.DecimalField(decimal_places=2, default=Decimal("8.00"), max_digits=10)),
                ("epic_amount", models.DecimalField(decimal_places=2, default=Decimal("20.00"), max_digits=10)),
                ("moneda", models.CharField(default="BOB", max_length=10)),
                ("activo", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(default=django.utils.timezone.now)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "db_table": "payment_creator_configs",
                "ordering": ["-updated_at"],
            },
        ),
        migrations.CreateModel(
            name="PaymentOrder",
            fields=[
                ("id_order", models.BigAutoField(primary_key=True, serialize=False)),
                ("id_stream", models.IntegerField()),
                ("id_canal", models.IntegerField()),
                ("id_usuario_viewer", models.IntegerField(blank=True, null=True)),
                ("nombre_viewer", models.CharField(blank=True, max_length=120, null=True)),
                ("order_type", models.CharField(choices=[("donation", "Donation")], default="donation", max_length=30)),
                ("donation_type", models.CharField(choices=[("flash", "Flash"), ("screen", "Screen"), ("epic", "Epic")], max_length=30)),
                ("monto", models.DecimalField(decimal_places=2, max_digits=10)),
                ("moneda", models.CharField(default="BOB", max_length=10)),
                ("mensaje", models.CharField(blank=True, max_length=180, null=True)),
                ("status", models.CharField(choices=[("pending", "Pending"), ("paid", "Paid"), ("cancelled", "Cancelled"), ("expired", "Expired"), ("failed", "Failed")], default="pending", max_length=30)),
                ("provider", models.CharField(default="mock", max_length=30)),
                ("provider_reference", models.CharField(max_length=150, unique=True)),
                ("qr_payload", models.TextField(blank=True, null=True)),
                ("qr_image_base64", models.TextField(blank=True, null=True)),
                ("qr_image_url", models.TextField(blank=True, null=True)),
                ("expires_at", models.DateTimeField()),
                ("paid_at", models.DateTimeField(blank=True, null=True)),
                ("cancelled_at", models.DateTimeField(blank=True, null=True)),
                ("created_at", models.DateTimeField(default=django.utils.timezone.now)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "db_table": "payment_orders",
                "ordering": ["-created_at"],
            },
        ),
        migrations.CreateModel(
            name="StreamDonation",
            fields=[
                ("id_donation", models.BigAutoField(primary_key=True, serialize=False)),
                ("id_stream", models.IntegerField()),
                ("id_canal", models.IntegerField()),
                ("id_usuario_viewer", models.IntegerField(blank=True, null=True)),
                ("nombre_viewer", models.CharField(blank=True, max_length=120, null=True)),
                ("donation_type", models.CharField(choices=[("flash", "Flash"), ("screen", "Screen"), ("epic", "Epic")], max_length=30)),
                ("monto", models.DecimalField(decimal_places=2, max_digits=10)),
                ("moneda", models.CharField(default="BOB", max_length=10)),
                ("mensaje", models.CharField(blank=True, max_length=180, null=True)),
                ("status", models.CharField(choices=[("confirmed", "Confirmed"), ("hidden", "Hidden")], default="confirmed", max_length=30)),
                ("created_at", models.DateTimeField(default=django.utils.timezone.now)),
                ("order", models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name="donation", to="payments.paymentorder")),
            ],
            options={
                "db_table": "stream_donations",
                "ordering": ["-created_at"],
            },
        ),
        migrations.CreateModel(
            name="DonationAlert",
            fields=[
                ("id_alert", models.BigAutoField(primary_key=True, serialize=False)),
                ("id_stream", models.IntegerField()),
                ("id_canal", models.IntegerField()),
                ("alert_type", models.CharField(choices=[("flash", "Flash"), ("screen", "Screen"), ("epic", "Epic")], max_length=30)),
                ("title", models.CharField(max_length=150)),
                ("message", models.CharField(blank=True, max_length=220, null=True)),
                ("animation_key", models.CharField(max_length=80)),
                ("shown", models.BooleanField(default=False)),
                ("created_at", models.DateTimeField(default=django.utils.timezone.now)),
                ("shown_at", models.DateTimeField(blank=True, null=True)),
                ("donation", models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name="alert", to="payments.streamdonation")),
            ],
            options={
                "db_table": "donation_alerts",
                "ordering": ["-created_at"],
            },
        ),
        migrations.AddIndex(
            model_name="paymentorder",
            index=models.Index(fields=["id_stream", "status"], name="payment_ord_id_stre_28f1c7_idx"),
        ),
        migrations.AddIndex(
            model_name="paymentorder",
            index=models.Index(fields=["id_canal", "status"], name="payment_ord_id_cana_64e65b_idx"),
        ),
        migrations.AddIndex(
            model_name="paymentorder",
            index=models.Index(fields=["provider_reference"], name="payment_ord_provide_a515b8_idx"),
        ),
        migrations.AddIndex(
            model_name="streamdonation",
            index=models.Index(fields=["id_stream", "created_at"], name="stream_dona_id_stre_dac169_idx"),
        ),
        migrations.AddIndex(
            model_name="streamdonation",
            index=models.Index(fields=["id_canal", "created_at"], name="stream_dona_id_cana_efb0e9_idx"),
        ),
        migrations.AddIndex(
            model_name="donationalert",
            index=models.Index(fields=["id_stream", "shown"], name="donation_al_id_stre_66ece9_idx"),
        ),
        migrations.AddIndex(
            model_name="donationalert",
            index=models.Index(fields=["id_canal", "shown"], name="donation_al_id_cana_fc299d_idx"),
        ),
    ]
