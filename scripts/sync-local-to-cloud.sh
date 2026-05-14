#!/bin/sh
set -e

echo "=========================================="
echo "ROOTBLEND - Sincronizacion Local -> Aiven"
echo "=========================================="
echo "ADVERTENCIA: Este proceso subira la copia local hacia Aiven."
echo "Usar solo despues de una contingencia controlada."
echo "=========================================="

DATABASES="
rootblend_usuarios
rootblend_canales_streaming
rootblend_estadisticas
rootblend_podcasts
rootblend_interacciones
"

mkdir -p /backups/local-to-cloud

for DB in $DATABASES
do
  echo ""
  echo "Preparando $DB desde MySQL local..."

  LOCAL_DUMP="/backups/local-to-cloud/${DB}_local.sql"
  CLOUD_BACKUP="/backups/local-to-cloud/${DB}_cloud_before_restore.sql"

  echo "Generando backup local de $DB..."

  mysqldump \
    -h "$LOCAL_DB_HOST" \
    -P "$LOCAL_DB_PORT" \
    -u "$LOCAL_DB_USER" \
    -p"$LOCAL_DB_PASSWORD" \
    --single-transaction \
    --routines \
    --triggers \
    --skip-lock-tables \
    "$DB" > "$LOCAL_DUMP"

  echo "Generando backup de seguridad actual de Aiven para $DB..."

  if mysqldump \
    -h "$CLOUD_DB_HOST" \
    -P "$CLOUD_DB_PORT" \
    -u "$CLOUD_DB_USER" \
    -p"$CLOUD_DB_PASSWORD" \
    --ssl-mode=REQUIRED \
    --single-transaction \
    --routines \
    --triggers \
    --skip-lock-tables \
    "$DB" > "$CLOUD_BACKUP"
  then
    echo "Backup de seguridad de Aiven generado: $CLOUD_BACKUP"
  else
    echo "No se pudo generar backup de Aiven para $DB."
    echo "Se cancela la subida de esta base por seguridad."
    continue
  fi

  echo "Recreando $DB en Aiven..."

  mysql \
    -h "$CLOUD_DB_HOST" \
    -P "$CLOUD_DB_PORT" \
    -u "$CLOUD_DB_USER" \
    -p"$CLOUD_DB_PASSWORD" \
    --ssl-mode=REQUIRED \
    -e "DROP DATABASE IF EXISTS $DB; CREATE DATABASE $DB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

  echo "Restaurando $DB local hacia Aiven..."

  mysql \
    -h "$CLOUD_DB_HOST" \
    -P "$CLOUD_DB_PORT" \
    -u "$CLOUD_DB_USER" \
    -p"$CLOUD_DB_PASSWORD" \
    --ssl-mode=REQUIRED \
    "$DB" < "$LOCAL_DUMP"

  echo "$DB restaurada en Aiven desde local."
done

echo ""
echo "=========================================="
echo "Sincronizacion Local -> Aiven finalizada"
echo "=========================================="