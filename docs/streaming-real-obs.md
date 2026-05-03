# ROOTBLEND - Streaming real con OBS

## Flujo base

OBS Studio envia video por RTMP al media-server:

```text
OBS -> rtmp://localhost:1935/live + stream_key
media-server -> http://localhost:8888/live/stream_key/index.m3u8
frontend -> LiveVideoPlayer con hls.js
```

## Servicios Docker

`docker-compose.yml` ahora incluye:

- `media-server`: MediaMTX con RTMP `1935`, HLS `8888` y WebRTC `8889`.
- `canales-streaming-service`: genera `stream_key`, `ingest_url`, `playback_url` y revisa senal HLS.
- `gateway`: usa nombres de servicio Docker y expone `/hls/` como proxy opcional.

## OBS

En `Control de transmision` abre `/creator/streamer/control` y copia:

- Servidor: `rtmp://localhost:1935/live`
- Clave: `rb_...`

En OBS:

1. Ve a `Settings > Stream`.
2. Servicio: `Custom`.
3. Server: pega el servidor RTMP.
4. Stream Key: pega la clave.
5. Inicia la transmision en OBS.

El HLS publico queda en:

```text
http://localhost:8888/live/<stream_key>/index.m3u8
```

## Endpoints nuevos

- `GET /api/streams/streams/mis-streams/`
- `GET /api/streams/streams/:id/obs-config/`
- `POST /api/streams/streams/:id/rotate-key/`
- `GET /api/streams/streams/:id/signal-status/`

## Reglas aplicadas

- No se puede iniciar un stream finalizado.
- No se puede iniciar un stream de otro usuario.
- No se puede iniciar si el canal esta inactivo.
- No se puede iniciar si el canal es podcaster.
- No se puede tener mas de un stream `en_vivo` por canal.
- La clave de transmision solo sale por `obs-config`, que exige token del propietario.
- La clave no se muestra en endpoints publicos.

## Migraciones

Para una base nueva:

```bash
docker compose exec canales-streaming-service python manage.py migrate
```

Para una base que ya tenia tablas creadas manualmente:

```bash
docker compose exec canales-streaming-service python manage.py migrate --fake-initial
```
