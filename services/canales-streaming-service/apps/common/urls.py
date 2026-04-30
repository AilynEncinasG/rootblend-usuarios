from django.urls import path

from .views import api_root_view, health_view

urlpatterns = [
    path("", api_root_view, name="api-root"),
    path("health/", health_view, name="health"),
]