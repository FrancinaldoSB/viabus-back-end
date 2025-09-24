#!/bin/sh
# wait-for-postgres.sh - Script simples para aguardar PostgreSQL

set -e

HOST=${1:-postgres-service}
PORT=${2:-5432}
TIMEOUT=${3:-60}

echo "Aguardando $HOST:$PORT ficar disponível..."

i=0
while [ $i -lt $TIMEOUT ]; do
    if nc -z "$HOST" "$PORT" 2>/dev/null; then
        echo "$HOST:$PORT está disponível!"
        exit 0
    fi
    
    echo "Aguardando... ($((i+1))/$TIMEOUT)"
    sleep 1
    i=$((i+1))
done

echo "Timeout: $HOST:$PORT não ficou disponível em $TIMEOUT segundos"
exit 1