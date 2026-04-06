# apps/preferencias/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('<int:id_usuario>/', views.ver_preferencias, name='ver_preferencias'),
    path('<int:id_usuario>/editar/', views.editar_preferencias, name='editar_preferencias'),
]