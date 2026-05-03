import secrets

from django.conf import settings
from django.db import migrations, models


def generate_stream_key():
    return f"rb_{secrets.token_urlsafe(24).replace('-', '').replace('_', '')[:32]}"


def populate_stream_runtime_fields(apps, schema_editor):
    Stream = apps.get_model("streams", "Stream")
    rtmp_server = settings.STREAM_RTMP_SERVER.rstrip("/")
    playback_base_url = settings.STREAM_PLAYBACK_BASE_URL.rstrip("/")

    for stream in Stream.objects.all():
        stream_key = stream.stream_key or generate_stream_key()

        while Stream.objects.exclude(id=stream.id).filter(stream_key=stream_key).exists():
            stream_key = generate_stream_key()

        stream.stream_key = stream_key
        stream.ingest_url = f"{rtmp_server}/{stream_key}"
        stream.playback_url = f"{playback_base_url}/{stream_key}/index.m3u8"
        stream.viewer_count = stream.viewer_count or 0
        stream.signal_status = stream.signal_status or "sin_senal"
        stream.save(
            update_fields=[
                "stream_key",
                "ingest_url",
                "playback_url",
                "viewer_count",
                "signal_status",
            ]
        )


class Migration(migrations.Migration):

    dependencies = [
        ("streams", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="stream",
            name="stream_key",
            field=models.CharField(blank=True, editable=False, max_length=80, null=True, unique=True),
        ),
        migrations.AddField(
            model_name="stream",
            name="ingest_url",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name="stream",
            name="playback_url",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name="stream",
            name="thumbnail_url",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name="stream",
            name="viewer_count",
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name="stream",
            name="signal_status",
            field=models.CharField(
                choices=[
                    ("sin_senal", "Sin senal"),
                    ("conectado", "Conectado"),
                    ("desconectado", "Desconectado"),
                    ("error", "Error"),
                ],
                default="sin_senal",
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name="stream",
            name="last_signal_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.RunPython(populate_stream_runtime_fields, migrations.RunPython.noop),
    ]
