from django.urls import path

from .views import (
    activar_canal,
    actualizar_mi_canal,
    detalle_canal,
    listar_canales,
    listar_canales_activos,
    mi_canal,
)

urlpatterns = [
    path("", listar_canales, name="listar-canales"),
    path("activos/", listar_canales_activos, name="listar-canales-activos"),
    path("mi-canal/", mi_canal, name="mi-canal"),
    path("activar/", activar_canal, name="activar-canal"),
    path("mi-canal/actualizar/", actualizar_mi_canal, name="actualizar-mi-canal"),
    path("<int:canal_id>/", detalle_canal, name="detalle-canal"),
]