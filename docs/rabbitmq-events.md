# RabbitMQ events

ROOTBLEND usa `rootblend.events` como exchange `topic` para eventos internos entre servicios.

## Eventos implementados

- `stream.started`: publica `canales-streaming-service`; consumen `interacciones-service` y `estadisticas-service`.
- `stream.ended`: publica `canales-streaming-service`; consumen `interacciones-service` y `estadisticas-service`.
- `viewer.joined`: publica `canales-streaming-service`; consume `estadisticas-service`.
- `viewer.left`: publica `canales-streaming-service`; consume `estadisticas-service`.
- `episode.played`: publica `podcasts-service`; consume `estadisticas-service`.

## Colas principales

- `rootblend.interacciones.stream`
- `rootblend.estadisticas.stream`
- `rootblend.estadisticas.podcast`
- `rootblend.audit.all`

## Consumers

```bash
docker compose -f docker-compose.yml -f docker-compose.local.yml logs -f estadisticas-events-consumer
docker compose -f docker-compose.yml -f docker-compose.local.yml logs -f interacciones-events-consumer
```

## Migraciones necesarias

```bash
docker compose -f docker-compose.yml -f docker-compose.local.yml exec estadisticas-service python manage.py migrate
docker compose -f docker-compose.yml -f docker-compose.local.yml exec interacciones-service php artisan migrate --force
```
