from django.urls import path
from .views import (
    episode_stats,
    health_view,
    podcast_episodes_stats,
    podcast_event,
    podcast_stats,
    stream_event,
    stream_stats,
)

urlpatterns = [
    path("health/", health_view, name="health"),
    path("streams/<int:id_stream>/", stream_stats, name="stream-stats"),
    path("podcasts/<int:id_podcast>/", podcast_stats, name="podcast-stats"),
    path("podcasts/<int:id_podcast>/episodes/", podcast_episodes_stats, name="podcast-episodes-stats"),
    path("episodes/<int:id_episodio>/", episode_stats, name="episode-stats"),
    path("events/stream/", stream_event, name="stream-event"),
    path("events/podcast/", podcast_event, name="podcast-event"),
]
