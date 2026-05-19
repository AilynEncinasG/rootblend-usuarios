from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("streams", "0001_initial"),
        ("momentos", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="momentodestacado",
            name="stream",
            field=models.ForeignKey(
                blank=True,
                db_column="id_stream",
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="momentos_destacados",
                to="streams.stream",
            ),
        ),
        migrations.AddField(
            model_name="momentodestacado",
            name="thumbnail_url",
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
        migrations.AddField(
            model_name="momentodestacado",
            name="destacado",
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name="momentodestacado",
            name="vistas_count",
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AlterField(
            model_name="momentodestacado",
            name="url_video",
            field=models.CharField(max_length=500),
        ),
    ]