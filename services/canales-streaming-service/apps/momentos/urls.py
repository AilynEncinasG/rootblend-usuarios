from django.urls import path

from .views import listar_momentos

urlpatterns = [
    path("", listar_momentos, name="listar-momentos"),
]