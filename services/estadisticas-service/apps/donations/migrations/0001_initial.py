# Generated manually for ROOT BLEND local Docker demo.
from decimal import Decimal

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="ProcessedDonationEvent",
            fields=[
                ("event_id", models.CharField(max_length=120, primary_key=True, serialize=False)),
                ("routing_key", models.CharField(max_length=120)),
                ("source", models.CharField(default="pagos-service", max_length=80)),
                ("processed_at", models.DateTimeField(default=django.utils.timezone.now)),
            ],
            options={
                "db_table": "processed_donation_events",
                "ordering": ["-processed_at"],
            },
        ),
        migrations.CreateModel(
            name="DonationRevenueEvent",
            fields=[
                ("id_revenue_event", models.BigAutoField(primary_key=True, serialize=False)),
                ("event_id", models.CharField(max_length=120, unique=True)),
                ("id_order", models.BigIntegerField()),
                ("id_donation", models.BigIntegerField()),
                ("id_alert", models.BigIntegerField(blank=True, null=True)),
                ("id_stream", models.IntegerField()),
                ("id_canal", models.IntegerField()),
                ("id_usuario_viewer", models.IntegerField(blank=True, null=True)),
                ("nombre_viewer", models.CharField(blank=True, max_length=120, null=True)),
                ("donation_type", models.CharField(max_length=30)),
                ("monto", models.DecimalField(decimal_places=2, max_digits=12)),
                ("moneda", models.CharField(default="BOB", max_length=10)),
                ("mensaje", models.CharField(blank=True, max_length=220, null=True)),
                ("provider", models.CharField(default="mock", max_length=30)),
                ("provider_reference", models.CharField(blank=True, max_length=150, null=True)),
                ("animation_key", models.CharField(blank=True, max_length=80, null=True)),
                ("paid_at", models.DateTimeField(blank=True, null=True)),
                ("occurred_at", models.DateTimeField(blank=True, null=True)),
                ("processed_at", models.DateTimeField(default=django.utils.timezone.now)),
            ],
            options={
                "db_table": "donation_revenue_events",
                "ordering": ["-processed_at"],
            },
        ),
        migrations.CreateModel(
            name="StreamDonationRevenueStats",
            fields=[
                ("id_stat", models.BigAutoField(primary_key=True, serialize=False)),
                ("id_stream", models.IntegerField(unique=True)),
                ("id_canal", models.IntegerField()),
                ("total_donations", models.PositiveIntegerField(default=0)),
                ("total_amount", models.DecimalField(decimal_places=2, default=Decimal("0.00"), max_digits=14)),
                ("flash_count", models.PositiveIntegerField(default=0)),
                ("flash_amount", models.DecimalField(decimal_places=2, default=Decimal("0.00"), max_digits=14)),
                ("screen_count", models.PositiveIntegerField(default=0)),
                ("screen_amount", models.DecimalField(decimal_places=2, default=Decimal("0.00"), max_digits=14)),
                ("epic_count", models.PositiveIntegerField(default=0)),
                ("epic_amount", models.DecimalField(decimal_places=2, default=Decimal("0.00"), max_digits=14)),
                ("highest_donation_amount", models.DecimalField(decimal_places=2, default=Decimal("0.00"), max_digits=14)),
                ("highest_donor_name", models.CharField(blank=True, max_length=120, null=True)),
                ("last_donation_amount", models.DecimalField(decimal_places=2, default=Decimal("0.00"), max_digits=14)),
                ("last_donor_name", models.CharField(blank=True, max_length=120, null=True)),
                ("last_donation_type", models.CharField(blank=True, max_length=30, null=True)),
                ("last_donation_at", models.DateTimeField(blank=True, null=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "db_table": "stream_donation_revenue_stats",
                "ordering": ["-total_amount"],
            },
        ),
        migrations.CreateModel(
            name="ChannelDonationRevenueStats",
            fields=[
                ("id_stat", models.BigAutoField(primary_key=True, serialize=False)),
                ("id_canal", models.IntegerField(unique=True)),
                ("total_donations", models.PositiveIntegerField(default=0)),
                ("total_amount", models.DecimalField(decimal_places=2, default=Decimal("0.00"), max_digits=14)),
                ("total_streams_with_donations", models.PositiveIntegerField(default=0)),
                ("highest_donation_amount", models.DecimalField(decimal_places=2, default=Decimal("0.00"), max_digits=14)),
                ("highest_donor_name", models.CharField(blank=True, max_length=120, null=True)),
                ("last_donation_amount", models.DecimalField(decimal_places=2, default=Decimal("0.00"), max_digits=14)),
                ("last_donor_name", models.CharField(blank=True, max_length=120, null=True)),
                ("last_donation_type", models.CharField(blank=True, max_length=30, null=True)),
                ("last_donation_at", models.DateTimeField(blank=True, null=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "db_table": "channel_donation_revenue_stats",
                "ordering": ["-total_amount"],
            },
        ),
        migrations.AddIndex(
            model_name="donationrevenueevent",
            index=models.Index(fields=["id_stream", "processed_at"], name="donation_re_id_stre_757a86_idx"),
        ),
        migrations.AddIndex(
            model_name="donationrevenueevent",
            index=models.Index(fields=["id_canal", "processed_at"], name="donation_re_id_cana_7fc5f6_idx"),
        ),
        migrations.AddIndex(
            model_name="donationrevenueevent",
            index=models.Index(fields=["donation_type"], name="donation_re_donatio_881c79_idx"),
        ),
    ]
