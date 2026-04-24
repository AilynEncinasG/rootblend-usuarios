from django.urls import path
from .views import MeView, UpdateProfileView

urlpatterns = [
    path("me/", MeView.as_view(), name="me"),
    path("me/profile/", UpdateProfileView.as_view(), name="update_profile"),
]