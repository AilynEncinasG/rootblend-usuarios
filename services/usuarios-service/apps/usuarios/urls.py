from django.urls import path
from .views import (
    MeView,
    UpdateProfileView,
    UploadProfilePhotoView,
    UploadProfileBannerView,
)

urlpatterns = [
    path("me/", MeView.as_view(), name="me"),
    path("me/profile/", UpdateProfileView.as_view(), name="update_profile"),
    path("me/profile/photo/", UploadProfilePhotoView.as_view(), name="upload_profile_photo"),
    path("me/profile/banner/", UploadProfileBannerView.as_view(), name="upload_profile_banner"),
]