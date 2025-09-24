#!/bin/bash

# Script para executar migrações do banco de dados
# Autor: GitHub Copilot

set -e

echo "🗃️  Executando migrações do banco de dados..."

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Mudar para o diretório do projeto
cd "$(dirname "$0")/.."

# Verificar se o PostgreSQL está rodando
print_status "Verificando se o PostgreSQL está pronto..."
kubectl wait --for=condition=ready pod -l app=postgres --timeout=60s

# Remover job anterior se existir
print_status "Removendo job de migração anterior (se existir)..."
kubectl delete job viabus-db-migration --ignore-not-found=true

# Aplicar job de migração
print_status "Iniciando job de migração..."
kubectl apply -f k8s/migration-job.yaml

# Aguardar conclusão
print_status "Aguardando conclusão das migrações..."
kubectl wait --for=condition=complete job/viabus-db-migration --timeout=300s

# Verificar se foi bem-sucedida
if kubectl get job viabus-db-migration -o jsonpath='{.status.conditions[?(@.type=="Complete")].status}' | grep -q "True"; then
    print_status "🎉 Migrações executadas com sucesso!"
    
    # Mostrar logs da migração
    print_status "Logs da migração:"
    kubectl logs job/viabus-db-migration
else
    print_error "❌ Falha na execução das migrações!"
    
    # Mostrar logs de erro
    print_error "Logs de erro:"
    kubectl logs job/viabus-db-migration
    exit 1
fi