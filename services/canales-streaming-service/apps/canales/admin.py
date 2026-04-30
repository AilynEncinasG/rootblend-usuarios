from django.contrib import admin

from .models import Canal, TipoCanal


@admin.register(TipoCanal)
class TipoCanalAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre_tipo", "descripcion")
    search_fields = ("nombre_tipo",)


@admin.register(Canal)
class CanalAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "nombre_canal",
        "id_usuario_propietario",
        "tipo_canal",
        "estado_canal",
        "fecha_creacion",
    )
    list_filter = ("tipo_canal", "estado_canal")
    search_fields = ("nombre_canal", "id_usuario_propietario")