from django.urls import path
from .views import PreferenceDetailView, PreferenceUpdateView

urlpatterns = [
    path("me/", PreferenceDetailView.as_view(), name="preference_detail"),
    path("me/update/", PreferenceUpdateView.as_view(), name="preference_update"),
]