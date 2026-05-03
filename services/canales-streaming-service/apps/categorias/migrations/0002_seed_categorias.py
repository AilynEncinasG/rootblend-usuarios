from django.db import migrations


def seed_categorias(apps, schema_editor):
    Categoria = apps.get_model("categorias", "Categoria")

    defaults = [
        ("Gaming", "Transmisiones de videojuegos y partidas competitivas"),
        ("Charlas", "Conversaciones, entrevistas y comunidad"),
        ("Musica", "Sesiones musicales, mixes y directo creativo"),
        ("Tecnologia", "Programacion, IA, gadgets y noticias tech"),
        ("Deportes", "Narraciones, analisis y eventos deportivos"),
        ("Podcasts", "Contenido de audio y episodios por demanda"),
    ]

    for nombre, descripcion in defaults:
        Categoria.objects.get_or_create(
            nombre=nombre,
            defaults={"descripcion": descripcion},
        )


def unseed_categorias(apps, schema_editor):
    Categoria = apps.get_model("categorias", "Categoria")
    Categoria.objects.filter(
        nombre__in=["Gaming", "Charlas", "Musica", "Tecnologia", "Deportes", "Podcasts"]
    ).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("categorias", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_categorias, unseed_categorias),
    ]
