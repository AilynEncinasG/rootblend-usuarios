from django.urls import path
from .views import health_view, stream_event, stream_stats

urlpatterns = [
    path("health/", health_view, name="health"),
    path("streams/<int:id_stream>/", stream_stats, name="stream-stats"),
    path("events/stream/", stream_event, name="stream-event"),
]
