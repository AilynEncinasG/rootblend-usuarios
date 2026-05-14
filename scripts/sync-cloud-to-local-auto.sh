#!/bin/sh

echo "=========================================="
echo "ROOTBLEND - Replica automatica Aiven -> Local"
echo "=========================================="

SYNC_INTERVAL_SECONDS="${SYNC_INTERVAL_SECONDS:-10}"

echo "Intervalo de sincronizacion: ${SYNC_INTERVAL_SECONDS} segundos"

while true
do
  echo ""
  echo "=========================================="
  echo "Ejecutando sincronizacion automatica..."
  echo "Fecha: $(date)"
  echo "=========================================="

  if sh /scripts/sync-cloud-to-local.sh
  then
    echo "Replica local actualizada correctamente."
  else
    echo "No se pudo sincronizar con Aiven."
    echo "Se conserva la ultima copia local disponible."
  fi

  echo "Esperando ${SYNC_INTERVAL_SECONDS} segundos para la siguiente sincronizacion..."
  sleep "$SYNC_INTERVAL_SECONDS"
done