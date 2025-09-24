#!/bin/bash

# Script para fazer o build e deploy da aplicação ViaBus no Minikube
# Com verificação inteligente de permissões Docker
# Autor: GitHub Copilot
# Data: $(date)

set -e

echo "🚀 Iniciando deploy do ViaBus API no Minikube..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para print colorido
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Função para executar comando Docker com ou sem sudo
run_docker() {
    # Verificar se o usuário está no grupo docker
    if groups | grep -q docker; then
        docker "$@"
    else
        print_warning "Usuário não está no grupo docker, usando sudo..."
        sudo docker "$@"
    fi
}

# Função para executar comando minikube com ou sem sudo
run_minikube() {
    # Verificar se minikube precisa de sudo (comum em algumas instalações)
    if minikube version > /dev/null 2>&1; then
        minikube "$@"
    else
        print_warning "Executando minikube com sudo..."
        sudo minikube "$@"
    fi
}

# Mudar para o diretório do projeto
cd "$(dirname "$0")/.."

# Verificar se o Minikube está rodando
print_status "Verificando se o Minikube está rodando..."
if ! run_minikube status > /dev/null 2>&1; then
    print_warning "Minikube não está rodando. Iniciando..."
    run_minikube start
else
    print_status "Minikube já está rodando"
fi

# Configurar Docker para usar o daemon do Minikube
print_status "Configurando Docker para usar daemon do Minikube..."
eval $(run_minikube docker-env)

# Build da imagem Docker
print_status "Fazendo build da imagem Docker..."
run_docker build -t viabus-api:latest .

# Habilitar addons necessários
print_status "Habilitando addons necessários do Minikube..."
run_minikube addons enable ingress

# Aplicar os manifests do Kubernetes
print_status "Aplicando ConfigMaps e Secrets..."
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml

print_status "Aplicando PostgreSQL..."
kubectl apply -f k8s/postgres.yaml

print_status "Aguardando PostgreSQL ficar pronto..."
kubectl wait --for=condition=ready pod -l app=postgres --timeout=300s

print_status "Executando migrações do banco de dados..."
kubectl apply -f k8s/migration-job.yaml
kubectl wait --for=condition=complete job/viabus-db-migration --timeout=180s

print_status "Aplicando aplicação..."
kubectl apply -f k8s/deployment.yaml

print_status "Aplicando Ingress..."
kubectl apply -f k8s/ingress.yaml

# Aguardar pods ficarem prontos
print_status "Aguardando pods ficarem prontos..."
kubectl wait --for=condition=ready pod -l app=viabus-api --timeout=300s

# Obter informações de acesso
print_status "🎉 Deploy concluído com sucesso!"
echo ""
print_status "Informações de acesso:"
echo "• Minikube IP: $(run_minikube ip)"
echo "• Para acessar via Ingress, adicione ao /etc/hosts:"
echo "  $(run_minikube ip) viabus-api.local"
echo ""
echo "• Acesso direto via NodePort:"
kubectl get service viabus-api-service
echo ""
echo "• Para acessar via port-forward:"
echo "  kubectl port-forward service/viabus-api-service 4000:4000"
echo ""
print_status "Verificando status dos pods:"
kubectl get pods -l app=viabus-api
kubectl get pods -l app=postgres

echo ""
print_status "🔧 Comandos úteis:"
echo "• Ver logs da API: kubectl logs -f -l app=viabus-api"
echo "• Ver logs do PostgreSQL: kubectl logs -f -l app=postgres"
echo "• Status completo: ./scripts/status.sh"
echo "• Health check: curl http://viabus-api.local/health"