from django.db import models

from apps.canales.models import Canal
from apps.streams.models import Stream


class MomentoDestacado(models.Model):
    canal = models.ForeignKey(
        Canal,
        on_delete=models.CASCADE,
        db_column="id_canal",
        related_name="momentos_destacados",
    )
    stream = models.ForeignKey(
        Stream,
        on_delete=models.SET_NULL,
        db_column="id_stream",
        related_name="momentos_destacados",
        null=True,
        blank=True,
    )
    titulo = models.CharField(max_length=150)
    descripcion = models.TextField(null=True, blank=True)
    url_video = models.CharField(max_length=500)
    thumbnail_url = models.CharField(max_length=500, null=True, blank=True)
    destacado = models.BooleanField(default=True)
    vistas_count = models.PositiveIntegerField(default=0)
    fecha_subida = models.DateTimeField(auto_now_add=True)
    duracion = models.TimeField(null=True, blank=True)

    class Meta:
        db_table = "momentos_destacados"
        verbose_name = "Momento destacado"
        verbose_name_plural = "Momentos destacados"

    def __str__(self):
        return self.titulo