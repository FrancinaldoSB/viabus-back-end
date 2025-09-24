#!/bin/bash

# Script para limpeza completa dos recursos do ViaBus no Minikube
# Autor: GitHub Copilot

set -e

echo "🧹 Iniciando limpeza dos recursos do ViaBus..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Deletar todos os recursos
print_status "Removendo Ingress..."
kubectl delete -f k8s/ingress.yaml --ignore-not-found=true

print_status "Removendo aplicação..."
kubectl delete -f k8s/deployment.yaml --ignore-not-found=true

print_status "Removendo jobs de migração..."
kubectl delete -f k8s/migration-job.yaml --ignore-not-found=true

print_status "Removendo PostgreSQL..."
kubectl delete -f k8s/postgres.yaml --ignore-not-found=true

print_status "Removendo ConfigMaps e Secrets..."
kubectl delete -f k8s/configmap.yaml --ignore-not-found=true
kubectl delete -f k8s/secrets.yaml --ignore-not-found=true

# Aguardar remoção completa
print_status "Aguardando remoção completa dos recursos..."
sleep 10

# Verificar se ainda existem recursos
print_status "Verificando recursos restantes..."
if kubectl get pods -l app=viabus-api 2>/dev/null | grep -q viabus-api; then
    print_warning "Ainda existem pods da aplicação"
else
    print_status "Todos os pods da aplicação foram removidos"
fi

if kubectl get pods -l app=postgres 2>/dev/null | grep -q postgres; then
    print_warning "Ainda existem pods do PostgreSQL"
else
    print_status "Todos os pods do PostgreSQL foram removidos"
fi

print_status "🎉 Limpeza concluída!"