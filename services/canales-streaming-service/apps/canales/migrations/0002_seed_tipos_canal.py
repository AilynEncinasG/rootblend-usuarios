from django.db import migrations


def seed_tipos_canal(apps, schema_editor):
    TipoCanal = apps.get_model("canales", "TipoCanal")

    defaults = [
        ("streamer", "Canal para transmisiones en vivo"),
        ("podcaster", "Canal para contenido en formato podcast"),
    ]

    for nombre_tipo, descripcion in defaults:
        TipoCanal.objects.get_or_create(
            nombre_tipo=nombre_tipo,
            defaults={"descripcion": descripcion},
        )


def unseed_tipos_canal(apps, schema_editor):
    TipoCanal = apps.get_model("canales", "TipoCanal")
    TipoCanal.objects.filter(nombre_tipo__in=["streamer", "podcaster"]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("canales", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_tipos_canal, unseed_tipos_canal),
    ]
