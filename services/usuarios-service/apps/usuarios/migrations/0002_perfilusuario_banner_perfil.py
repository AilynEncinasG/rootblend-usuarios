from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("usuarios", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="perfilusuario",
            name="banner_perfil",
            field=models.CharField(blank=True, max_length=1000, null=True),
        ),
    ]