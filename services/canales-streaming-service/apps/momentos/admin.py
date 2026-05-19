from django.contrib import admin

from .models import MomentoDestacado


@admin.register(MomentoDestacado)
class MomentoDestacadoAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "titulo",
        "canal",
        "stream",
        "destacado",
        "vistas_count",
        "fecha_subida",
    )
    list_filter = ("destacado", "fecha_subida")
    search_fields = ("titulo", "descripcion", "canal__nombre_canal")