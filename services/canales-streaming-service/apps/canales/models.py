from django.db import models


class TipoCanal(models.Model):
    STREAMER = "streamer"
    PODCASTER = "podcaster"

    nombre_tipo = models.CharField(max_length=50, unique=True)
    descripcion = models.TextField(null=True, blank=True)

    class Meta:
        db_table = "tipos_canal"
        verbose_name = "Tipo de canal"
        verbose_name_plural = "Tipos de canal"

    def __str__(self):
        return self.nombre_tipo


class Canal(models.Model):
    ACTIVO = "activo"
    INACTIVO = "inactivo"

    ESTADOS = [
        (ACTIVO, "Activo"),
        (INACTIVO, "Inactivo"),
    ]

    id_usuario_propietario = models.IntegerField()
    tipo_canal = models.ForeignKey(
        TipoCanal,
        on_delete=models.PROTECT,
        db_column="id_tipo_canal",
        related_name="canales",
    )
    nombre_canal = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(null=True, blank=True)
    foto_canal = models.CharField(max_length=255, null=True, blank=True)
    banner_canal = models.CharField(max_length=255, null=True, blank=True)
    estado_canal = models.CharField(
        max_length=20,
        choices=ESTADOS,
        default=ACTIVO,
    )
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "canales"
        verbose_name = "Canal"
        verbose_name_plural = "Canales"

    def __str__(self):
        return self.nombre_canal

    @property
    def es_streamer(self):
        return self.tipo_canal.nombre_tipo == TipoCanal.STREAMER

    @property
    def es_podcaster(self):
        return self.tipo_canal.nombre_tipo == TipoCanal.PODCASTER