from django.urls import path

from .views import (
    crear_stream,
    detalle_stream,
    finalizar_stream,
    iniciar_stream,
    listar_streams,
    streams_destacados,
    streams_en_vivo,
)

urlpatterns = [
    path("", listar_streams, name="listar-streams"),
    path("en-vivo/", streams_en_vivo, name="streams-en-vivo"),
    path("destacados/", streams_destacados, name="streams-destacados"),
    path("crear/", crear_stream, name="crear-stream"),
    path("<int:stream_id>/", detalle_stream, name="detalle-stream"),
    path("<int:stream_id>/iniciar/", iniciar_stream, name="iniciar-stream"),
    path("<int:stream_id>/finalizar/", finalizar_stream, name="finalizar-stream"),
]