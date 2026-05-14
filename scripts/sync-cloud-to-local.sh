#!/bin/sh
set -e

echo "=========================================="
echo "ROOTBLEND - Sincronizacion Aiven -> Local"
echo "=========================================="

DATABASES="
rootblend_usuarios
rootblend_canales_streaming
rootblend_estadisticas
rootblend_podcasts
rootblend_interacciones
"

mkdir -p /backups

echo "Probando conexion con Aiven..."
mysql \
  -h "$CLOUD_DB_HOST" \
  -P "$CLOUD_DB_PORT" \
  -u "$CLOUD_DB_USER" \
  -p"$CLOUD_DB_PASSWORD" \
  --ssl-mode=REQUIRED \
  -e "SHOW DATABASES;"

echo "Probando conexion con MySQL local..."
mysql \
  -h "$LOCAL_DB_HOST" \
  -P "$LOCAL_DB_PORT" \
  -u "$LOCAL_DB_USER" \
  -p"$LOCAL_DB_PASSWORD" \
  -e "SHOW DATABASES;"

for DB in $DATABASES
do
  echo ""
  echo "=========================================="
  echo "Sincronizando base: $DB"
  echo "=========================================="

  TMP_FILE="/backups/${DB}.tmp.sql"
  FINAL_FILE="/backups/${DB}.sql"

  echo "Descargando $DB desde Aiven sin GTID..."

  mysqldump \
    -h "$CLOUD_DB_HOST" \
    -P "$CLOUD_DB_PORT" \
    -u "$CLOUD_DB_USER" \
    -p"$CLOUD_DB_PASSWORD" \
    --ssl-mode=REQUIRED \
    --single-transaction \
    --routines \
    --triggers \
    --events \
    --skip-lock-tables \
    --set-gtid-purged=OFF \
    "$DB" > "$TMP_FILE"

  mv "$TMP_FILE" "$FINAL_FILE"
  echo "Backup de $DB descargado correctamente."

  echo "Recreando $DB en MySQL local..."

  mysql \
    -h "$LOCAL_DB_HOST" \
    -P "$LOCAL_DB_PORT" \
    -u "$LOCAL_DB_USER" \
    -p"$LOCAL_DB_PASSWORD" \
    -e "DROP DATABASE IF EXISTS $DB; CREATE DATABASE $DB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

  echo "Restaurando $DB en MySQL local..."

  mysql \
    -h "$LOCAL_DB_HOST" \
    -P "$LOCAL_DB_PORT" \
    -u "$LOCAL_DB_USER" \
    -p"$LOCAL_DB_PASSWORD" \
    "$DB" < "$FINAL_FILE"

  echo "$DB sincronizada correctamente en local."
done

echo ""
echo "=========================================="
echo "Sincronizacion Aiven -> Local finalizada"
echo "=========================================="