from django.db import models


class EstadisticaStream(models.Model):
    id_estadistica_stream = models.AutoField(primary_key=True)
    id_stream = models.IntegerField()
    total_vistas = models.IntegerField(default=0)
    espectadores_pico = models.IntegerField(default=0)
    duracion_total = models.TimeField(null=True, blank=True)
    fecha_generacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "estadisticas_stream"
        verbose_name = "Estadistica de stream"
        verbose_name_plural = "Estadisticas de stream"


class MetricaAudiencia(models.Model):
    id_metrica_audiencia = models.AutoField(primary_key=True)
    estadistica_stream = models.ForeignKey(
        EstadisticaStream,
        on_delete=models.CASCADE,
        db_column="id_estadistica_stream",
        related_name="metricas_audiencia",
    )
    espectadores_actuales = models.IntegerField(default=0)
    espectadores_unicos = models.IntegerField(default=0)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    origen_trafico = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        db_table = "metricas_audiencia"
        verbose_name = "Metrica de audiencia"
        verbose_name_plural = "Metricas de audiencia"


class MetricaChat(models.Model):
    id_metrica_chat = models.AutoField(primary_key=True)
    estadistica_stream = models.ForeignKey(
        EstadisticaStream,
        on_delete=models.CASCADE,
        db_column="id_estadistica_stream",
        related_name="metricas_chat",
    )
    total_mensajes = models.IntegerField(default=0)
    mensajes_eliminados = models.IntegerField(default=0)
    usuarios_activos = models.IntegerField(default=0)
    fecha_registro = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "metricas_chat"
        verbose_name = "Metrica de chat"
        verbose_name_plural = "Metricas de chat"


class EstadisticaPodcast(models.Model):
    id_estadistica_podcast = models.AutoField(primary_key=True)
    id_podcast = models.IntegerField()
    total_reproducciones = models.IntegerField(default=0)
    episodios_publicados = models.IntegerField(default=0)
    duracion_acumulada = models.TimeField(null=True, blank=True)
    fecha_generacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "estadisticas_podcast"
        verbose_name = "Estadistica de podcast"
        verbose_name_plural = "Estadisticas de podcast"


class ReproduccionPodcast(models.Model):
    id_reproduccion = models.AutoField(primary_key=True)
    estadistica_podcast = models.ForeignKey(
        EstadisticaPodcast,
        on_delete=models.CASCADE,
        db_column="id_estadistica_podcast",
        related_name="reproducciones",
    )
    id_episodio = models.IntegerField()
    fecha_reproduccion = models.DateTimeField(auto_now_add=True)
    tiempo_escuchado = models.TimeField(null=True, blank=True)
    completado = models.BooleanField(default=False)
    dispositivo = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        db_table = "reproducciones_podcast"
        verbose_name = "Reproduccion de podcast"
        verbose_name_plural = "Reproducciones de podcast"


class ResumenAnalitico(models.Model):
    id_resumen = models.AutoField(primary_key=True)
    tipo_resumen = models.CharField(max_length=50)
    periodo = models.CharField(max_length=50)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    descripcion = models.TextField(null=True, blank=True)

    class Meta:
        db_table = "resumenes_analiticos"
        verbose_name = "Resumen analitico"
        verbose_name_plural = "Resumenes analiticos"
