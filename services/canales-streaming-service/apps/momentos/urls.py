from django.urls import path

from .views import (
    crear_momento,
    detalle_momento,
    editar_momento,
    eliminar_momento,
    listar_momentos,
    mis_momentos,
    upload_momento_media,
)

urlpatterns = [
    path("", listar_momentos, name="listar-momentos"),
    path("mis-momentos/", mis_momentos, name="mis-momentos"),
    path("crear/", crear_momento, name="crear-momento"),
    path("upload/", upload_momento_media, name="upload-momento-media"),
    path("<int:momento_id>/", detalle_momento, name="detalle-momento"),
    path("<int:momento_id>/editar/", editar_momento, name="editar-momento"),
    path("<int:momento_id>/eliminar/", eliminar_momento, name="eliminar-momento"),
]