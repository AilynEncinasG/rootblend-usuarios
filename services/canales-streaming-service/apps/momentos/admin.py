from django.contrib import admin

from .models import MomentoDestacado


@admin.register(MomentoDestacado)
class MomentoDestacadoAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "titulo",
        "canal",
        "fecha_subida",
        "duracion",
    )
    search_fields = ("titulo", "canal__nombre_canal")