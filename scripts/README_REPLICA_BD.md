# ROOTBLEND - Comandos principales de réplica y contingencia

## 1. Levantar el sistema normal con Aiven

```bash
docker compose up --build -d
```

Este comando levanta todo el sistema usando **Aiven como base principal** y también levanta la réplica automática:

```txt
Aiven → MySQL local
```

---

## 2. Ver contenedores levantados

```bash
docker compose ps
```

También se puede usar:

```bash
docker ps -a
```

---

## 3. Ver si los sincronizadores están activos

```bash
docker ps -a | findstr db-sync
```

Sirve para revisar estos contenedores:

```txt
rootblend-db-sync-cloud-to-local
rootblend-db-sync-auto-cloud-to-local
rootblend-db-sync-local-to-cloud
```

---

## 4. Ver logs de la réplica automática Aiven → Local

```bash
docker logs -f rootblend-db-sync-auto-cloud-to-local
```

Este es el comando más importante para verificar que cada 10 segundos se está copiando la información desde Aiven hacia MySQL local.

---

## 5. Ejecutar sincronización manual Aiven → Local

```bash
docker compose up -d db-sync-cloud-to-local
```

Ver logs de la sincronización manual:

```bash
docker logs rootblend-db-sync-cloud-to-local
```

Este comando sirve para forzar una copia manual desde Aiven hacia la base local.

---

## 6. Levantar el sistema usando MySQL local si Aiven falla

```bash
docker compose -f docker-compose.yml -f docker-compose.local.yml up --build -d
```

Este comando levanta el sistema usando la base local:

```txt
mysql-local:3306
```

En este modo, los microservicios dejan de usar Aiven y trabajan con MySQL local dentro de Docker.

---

## 7. Detener la réplica automática si vas a trabajar en modo local

```bash
docker stop rootblend-db-sync-auto-cloud-to-local
```

Esto evita que la réplica Aiven → Local intente sobrescribir la base local mientras se está usando como contingencia.

---

## 8. Subir datos de local hacia Aiven

```bash
docker compose --profile recover up db-sync-local-to-cloud
```

Ver logs de recuperación:

```bash
docker logs rootblend-db-sync-local-to-cloud
```

Este comando se usa cuando Aiven vuelve a estar disponible y se necesita recuperar los datos creados en local durante la contingencia.

---

## 9. Apagar todo

```bash
docker compose down
```

---

## 10. Probar health checks

Frontend:

```txt
http://localhost:5173
```

Health check de usuarios:

```txt
http://localhost:8080/api/usuarios-health/
```

Health check de streams:

```txt
http://localhost:8080/api/streams-health/
```

Health check de podcasts:

```txt
http://localhost:8080/api/podcasts-health/
```

---

## Resumen rápido

```bash
docker compose up --build -d
docker compose ps
docker ps -a | findstr db-sync
docker logs -f rootblend-db-sync-auto-cloud-to-local
docker compose up -d db-sync-cloud-to-local
docker logs rootblend-db-sync-cloud-to-local
docker compose -f docker-compose.yml -f docker-compose.local.yml up --build -d
docker stop rootblend-db-sync-auto-cloud-to-local
docker compose --profile recover up db-sync-local-to-cloud
docker logs rootblend-db-sync-local-to-cloud
docker compose down
```