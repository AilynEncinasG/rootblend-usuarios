# apps/usuarios/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.lista_usuarios, name='lista_usuarios'),
    path('<int:id>/', views.detalle_usuario, name='detalle_usuario'),
]