from django.contrib import admin

from .models import ConfiguracionStream, Stream


@admin.register(Stream)
class StreamAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "titulo",
        "canal",
        "categoria",
        "estado",
        "destacado",
        "fecha_inicio",
        "fecha_fin",
    )
    list_filter = ("estado", "destacado", "categoria")
    search_fields = ("titulo", "canal__nombre_canal")


@admin.register(ConfiguracionStream)
class ConfiguracionStreamAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "stream",
        "resolucion",
        "bitrate",
        "latencia_modo",
        "audio_activo",
    )