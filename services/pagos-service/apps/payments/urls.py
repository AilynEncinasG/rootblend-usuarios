from django.urls import path

from .views import (
    CreateDonationOrderView,
    CreatorPaymentConfigView,
    HealthView,
    MarkDonationAlertShownView,
    PaymentOrderStatusView,
    PaymentsSummaryView,
    PublicChannelDonationConfigView,
    SimulatePaidOrderView,
    StreamDonationAlertsView,
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

    path(
        "streams/<int:id_stream>/donations/order",
        CreateDonationOrderView.as_view(),
        name="create_donation_order_no_slash",
    ),
    path(
        "streams/<int:id_stream>/donations/order/",
        CreateDonationOrderView.as_view(),
        name="create_donation_order",
    ),

    path(
        "orders/<int:id_order>/status",
        PaymentOrderStatusView.as_view(),
        name="payment_order_status_no_slash",
    ),
    path(
        "orders/<int:id_order>/status/",
        PaymentOrderStatusView.as_view(),
        name="payment_order_status",
    ),

    path(
        "orders/<int:id_order>/simulate-paid",
        SimulatePaidOrderView.as_view(),
        name="simulate_paid_order_no_slash",
    ),
    path(
        "orders/<int:id_order>/simulate-paid/",
        SimulatePaidOrderView.as_view(),
        name="simulate_paid_order",
    ),

    path(
        "streams/<int:id_stream>/donation-alerts",
        StreamDonationAlertsView.as_view(),
        name="stream_donation_alerts_no_slash",
    ),
    path(
        "streams/<int:id_stream>/donation-alerts/",
        StreamDonationAlertsView.as_view(),
        name="stream_donation_alerts",
    ),

    path(
        "alerts/<int:id_alert>/mark-shown",
        MarkDonationAlertShownView.as_view(),
        name="mark_donation_alert_shown_no_slash",
    ),
    path(
        "alerts/<int:id_alert>/mark-shown/",
        MarkDonationAlertShownView.as_view(),
        name="mark_donation_alert_shown",
    ),
]