import secrets

from django.conf import settings
from django.db import models

from apps.canales.models import Canal
from apps.categorias.models import Categoria


class Stream(models.Model):
    PROGRAMADO = "programado"
    EN_VIVO = "en_vivo"
    FINALIZADO = "finalizado"

    SIN_SENAL = "sin_senal"
    CONECTADO = "conectado"
    DESCONECTADO = "desconectado"
    ERROR = "error"

    ESTADOS = [
        (PROGRAMADO, "Programado"),
        (EN_VIVO, "En vivo"),
        (FINALIZADO, "Finalizado"),
    ]

    ESTADOS_SENAL = [
        (SIN_SENAL, "Sin senal"),
        (CONECTADO, "Conectado"),
        (DESCONECTADO, "Desconectado"),
        (ERROR, "Error"),
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
    stream_key = models.CharField(
        max_length=80,
        unique=True,
        null=True,
        blank=True,
        editable=False,
    )
    ingest_url = models.CharField(max_length=255, null=True, blank=True)
    playback_url = models.CharField(max_length=255, null=True, blank=True)
    thumbnail_url = models.CharField(max_length=255, null=True, blank=True)
    viewer_count = models.PositiveIntegerField(default=0)
    signal_status = models.CharField(
        max_length=20,
        choices=ESTADOS_SENAL,
        default=SIN_SENAL,
    )
    last_signal_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "streams"
        verbose_name = "Stream"
        verbose_name_plural = "Streams"

    def __str__(self):
        return self.titulo

    @staticmethod
    def generate_stream_key():
        return f"rb_{secrets.token_urlsafe(24).replace('-', '').replace('_', '')[:32]}"

    def build_stream_urls(self):
        if not self.stream_key:
            return

        rtmp_server = settings.STREAM_RTMP_SERVER.rstrip("/")
        playback_base_url = settings.STREAM_PLAYBACK_BASE_URL.rstrip("/")

        self.ingest_url = f"{rtmp_server}/{self.stream_key}"
        self.playback_url = f"{playback_base_url}/{self.stream_key}/index.m3u8"

    def ensure_stream_key(self):
        if self.stream_key:
            return

        stream_key = self.generate_stream_key()

        while Stream.objects.filter(stream_key=stream_key).exists():
            stream_key = self.generate_stream_key()

        self.stream_key = stream_key

    def rotate_stream_key(self):
        self.stream_key = None
        self.ensure_stream_key()
        self.build_stream_urls()

    def save(self, *args, **kwargs):
        self.ensure_stream_key()
        self.build_stream_urls()
        super().save(*args, **kwargs)


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
        verbose_name = "Configuracion de stream"
        verbose_name_plural = "Configuraciones de stream"

    def __str__(self):
        return f"Configuracion de {self.stream.titulo}"
