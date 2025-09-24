#!/bin/bash

# Script para testar conectividade com PostgreSQL
# Autor: GitHub Copilot

echo "🔌 Testando conectividade com PostgreSQL..."

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

# Verificar se o PostgreSQL está rodando
print_status "Verificando pods do PostgreSQL..."
kubectl get pods -l app=postgres

# Testar conectividade interna
print_status "Testando conectividade interna..."
POSTGRES_POD=$(kubectl get pods -l app=postgres -o jsonpath='{.items[0].metadata.name}' 2>/dev/null || echo "")

if [ -z "$POSTGRES_POD" ]; then
    print_error "Nenhum pod PostgreSQL encontrado!"
    exit 1
fi

print_status "Pod PostgreSQL: $POSTGRES_POD"

# Testar pg_isready
print_status "Testando pg_isready..."
if kubectl exec $POSTGRES_POD -- pg_isready -U postgres; then
    print_status "✅ PostgreSQL está aceitando conexões!"
else
    print_error "❌ PostgreSQL não está respondendo!"
fi

# Testar conexão do banco
print_status "Testando conexão com o banco viabus..."
if kubectl exec $POSTGRES_POD -- psql -U postgres -d viabus -c "SELECT version();" > /dev/null 2>&1; then
    print_status "✅ Banco viabus está acessível!"
    
    # Mostrar informações do banco
    print_status "Informações do banco:"
    kubectl exec $POSTGRES_POD -- psql -U postgres -d viabus -c "
        SELECT 
            schemaname,
            tablename,
            tableowner
        FROM pg_tables 
        WHERE schemaname NOT IN ('information_schema','pg_catalog')
        ORDER BY schemaname, tablename;
    "
else
    print_warning "⚠️  Banco viabus pode não existir ainda ou não está acessível"
    
    # Tentar criar o banco
    print_status "Tentando criar banco viabus..."
    kubectl exec $POSTGRES_POD -- psql -U postgres -c "CREATE DATABASE viabus;" 2>/dev/null || print_warning "Banco pode já existir"
fi

# Testar conectividade de dentro de um pod temporário
print_status "Testando conectividade de um pod temporário..."
kubectl run test-postgres --rm -i --restart=Never --image=postgres:15-alpine -- sh -c "
    export PGPASSWORD=admin
    pg_isready -h postgres-service -p 5432 -U postgres
    echo 'Conectividade OK!'
" 2>/dev/null && print_status "✅ Conectividade via Service funcionando!" || print_warning "⚠️  Problema na conectividade via Service"

print_status "🎉 Teste de conectividade concluído!"