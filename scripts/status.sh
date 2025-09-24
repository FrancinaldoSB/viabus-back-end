#!/bin/bash

# Script para monitoramento dos recursos do ViaBus no Minikube
# Autor: GitHub Copilot

echo "📊 Status dos recursos ViaBus no Minikube"
echo "========================================"

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_section() {
    echo -e "\n${YELLOW}$1${NC}"
    echo "----------------------------------------"
}

# Status do Minikube
print_section "🐳 Status do Minikube"
minikube status

# Status dos Pods
print_section "🚀 Status dos Pods"
kubectl get pods -o wide

# Status dos Services
print_section "🌐 Status dos Services"
kubectl get services

# Status dos Deployments
print_section "📦 Status dos Deployments"
kubectl get deployments

# Status dos Jobs
print_section "⚙️  Status dos Jobs"
kubectl get jobs

# Status do Ingress
print_section "🔗 Status do Ingress"
kubectl get ingress

# ConfigMaps e Secrets
print_section "⚙️  ConfigMaps"
kubectl get configmaps

print_section "🔐 Secrets"
kubectl get secrets

# PVCs
print_section "💾 Persistent Volume Claims"
kubectl get pvc

# Logs das aplicações (últimas 10 linhas)
print_section "📝 Logs da API (últimas 10 linhas)"
if kubectl get pods -l app=viabus-api -o name | head -1 > /dev/null 2>&1; then
    kubectl logs -l app=viabus-api --tail=10
else
    echo "Nenhum pod da API encontrado"
fi

print_section "📝 Logs do PostgreSQL (últimas 10 linhas)"
if kubectl get pods -l app=postgres -o name | head -1 > /dev/null 2>&1; then
    kubectl logs -l app=postgres --tail=10
else
    echo "Nenhum pod do PostgreSQL encontrado"
fi

# Informações de acesso
print_section "🌍 Informações de Acesso"
echo "Minikube IP: $(minikube ip)"
echo ""
echo "Para acessar a aplicação:"
echo "1. Via Ingress (adicione ao /etc/hosts):"
echo "   $(minikube ip) viabus-api.local"
echo "   Acesse: http://viabus-api.local"
echo ""
echo "2. Via Port Forward:"
echo "   kubectl port-forward service/viabus-api-service 4000:4000"
echo "   Acesse: http://localhost:4000"
echo ""
echo "3. Health Check:"
echo "   curl http://viabus-api.local/health"