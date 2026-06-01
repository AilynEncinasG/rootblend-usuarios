from django.urls import path

from .views import (
    ChannelDonationStatsView,
    DonationsHealthView,
    StreamDonationStatsView,
)


urlpatterns = [
    path("health/", DonationsHealthView.as_view(), name="donations_stats_health"),
    path("streams/<int:id_stream>/", StreamDonationStatsView.as_view(), name="stream_donation_stats"),
    path("channels/<int:id_canal>/", ChannelDonationStatsView.as_view(), name="channel_donation_stats"),
]