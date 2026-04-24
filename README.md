# ROOTBLEND

Arquitectura distribuida basada en microservicios.

## Estructura

- `frontend/` -> aplicación React
- `services/usuarios-service/` -> Django
- `services/canales-streaming-service/` -> Django
- `services/estadisticas-service/` -> Django
- `services/podcasts-service/` -> Laravel
- `services/interacciones-service/` -> Laravel
- `services/chat-service/` -> Firebase Realtime Database
- `gateway/` -> Nginx / API Gateway
- `infra/` -> infraestructura auxiliar

## Estado actual

- [x] Frontend base
- [x] Usuarios service inicial
- [ ] JWT real
- [ ] Dockerización
- [ ] Gateway
- [ ] Eventos
- [ ] Microservicios restantes