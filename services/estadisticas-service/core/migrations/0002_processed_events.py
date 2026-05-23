from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="ProcessedEvent",
            fields=[
                ("id_processed_event", models.AutoField(primary_key=True, serialize=False)),
                ("event_id", models.CharField(max_length=64, unique=True)),
                ("event_type", models.CharField(max_length=80)),
                ("source_service", models.CharField(blank=True, max_length=80, null=True)),
                ("processed_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={
                "db_table": "processed_events",
                "verbose_name": "Evento procesado",
                "verbose_name_plural": "Eventos procesados",
            },
        ),
    ]
