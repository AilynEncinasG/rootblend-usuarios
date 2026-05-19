from django.urls import path

from .views import (
    activar_canal,
    actualizar_mi_canal,
    detalle_canal,
    listar_canales,
    listar_canales_activos,
    mi_canal,
    subir_imagen_mi_canal,
)

urlpatterns = [
    path("", listar_canales, name="listar-canales"),
    path("activos/", listar_canales_activos, name="listar-canales-activos"),
    path("mi-canal/", mi_canal, name="mi-canal"),
    path("activar/", activar_canal, name="activar-canal"),
    path("mi-canal/actualizar/", actualizar_mi_canal, name="actualizar-mi-canal"),
    path("mi-canal/editar/", actualizar_mi_canal, name="editar-mi-canal"),
    path("mi-canal/upload-image/", subir_imagen_mi_canal, name="subir-imagen-mi-canal"),
    path("<int:canal_id>/", detalle_canal, name="detalle-canal"),
]