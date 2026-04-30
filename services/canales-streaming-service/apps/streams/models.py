from django.db import models

from apps.canales.models import Canal
from apps.categorias.models import Categoria


class Stream(models.Model):
    PROGRAMADO = "programado"
    EN_VIVO = "en_vivo"
    FINALIZADO = "finalizado"

    ESTADOS = [
        (PROGRAMADO, "Programado"),
        (EN_VIVO, "En vivo"),
        (FINALIZADO, "Finalizado"),
    ]

    canal = models.ForeignKey(
        Canal,
        on_delete=models.CASCADE,
        db_column="id_canal",
        related_name="streams",
    )
    categoria = models.ForeignKey(
        Categoria,
        on_delete=models.PROTECT,
        db_column="id_categoria",
        related_name="streams",
    )
    titulo = models.CharField(max_length=150)
    descripcion = models.TextField(null=True, blank=True)
    estado = models.CharField(
        max_length=20,
        choices=ESTADOS,
        default=PROGRAMADO,
    )
    fecha_inicio = models.DateTimeField(null=True, blank=True)
    fecha_fin = models.DateTimeField(null=True, blank=True)
    calidad_actual = models.CharField(max_length=30, null=True, blank=True)
    destacado = models.BooleanField(default=False)

    class Meta:
        db_table = "streams"
        verbose_name = "Stream"
        verbose_name_plural = "Streams"

    def __str__(self):
        return self.titulo


class ConfiguracionStream(models.Model):
    stream = models.OneToOneField(
        Stream,
        on_delete=models.CASCADE,
        db_column="id_stream",
        related_name="configuracion",
    )
    resolucion = models.CharField(max_length=20, default="720p")
    bitrate = models.IntegerField(default=2500)
    latencia_modo = models.CharField(max_length=30, default="normal")
    audio_activo = models.BooleanField(default=True)

    class Meta:
        db_table = "configuraciones_stream"
        verbose_name = "Configuración de stream"
        verbose_name_plural = "Configuraciones de stream"

    def __str__(self):
        return f"Configuración de {self.stream.titulo}"