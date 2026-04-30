from django.urls import path

from .views import listar_categorias

urlpatterns = [
    path("", listar_categorias, name="listar-categorias"),
]