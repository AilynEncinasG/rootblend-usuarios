from django.urls import path

from .views import (
    CreatorPaymentConfigView,
    HealthView,
    PaymentsSummaryView,
    PublicChannelDonationConfigView,
    VersionView,
)


urlpatterns = [
    path("health", HealthView.as_view(), name="payments_health_no_slash"),
    path("health/", HealthView.as_view(), name="payments_health"),

    path("version", VersionView.as_view(), name="payments_version_no_slash"),
    path("version/", VersionView.as_view(), name="payments_version"),

    path("summary", PaymentsSummaryView.as_view(), name="payments_summary_no_slash"),
    path("summary/", PaymentsSummaryView.as_view(), name="payments_summary"),

    path("creator/config", CreatorPaymentConfigView.as_view(), name="creator_payment_config_no_slash"),
    path("creator/config/", CreatorPaymentConfigView.as_view(), name="creator_payment_config"),

    path(
        "channels/<int:id_canal>/donation-config",
        PublicChannelDonationConfigView.as_view(),
        name="public_channel_donation_config_no_slash",
    ),
    path(
        "channels/<int:id_canal>/donation-config/",
        PublicChannelDonationConfigView.as_view(),
        name="public_channel_donation_config",
    ),
]