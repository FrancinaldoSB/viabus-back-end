#!/bin/bash

# Script para verificar e configurar permissões Docker
# Autor: GitHub Copilot

echo "🔍 Verificando configuração Docker e Minikube..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

echo ""
echo "=== Verificação do Docker ==="

# Verificar se o Docker está instalado
if command -v docker > /dev/null 2>&1; then
    print_success "Docker está instalado: $(docker --version)"
else
    print_error "Docker não está instalado"
    exit 1
fi

# Verificar se o usuário está no grupo docker
if groups | grep -q docker; then
    print_success "Usuário está no grupo docker"
    NEED_SUDO_DOCKER=false
else
    print_warning "Usuário NÃO está no grupo docker"
    print_info "Para adicionar ao grupo docker execute:"
    echo "    sudo usermod -aG docker \$USER"
    echo "    newgrp docker"
    NEED_SUDO_DOCKER=true
fi

# Testar comando docker
if docker info > /dev/null 2>&1; then
    print_success "Docker funciona sem sudo"
elif sudo docker info > /dev/null 2>&1; then
    print_warning "Docker requer sudo"
else
    print_error "Docker não está funcionando"
fi

echo ""
echo "=== Verificação do Minikube ==="

# Verificar se o Minikube está instalado
if command -v minikube > /dev/null 2>&1; then
    print_success "Minikube está instalado: $(minikube version --short)"
else
    print_error "Minikube não está instalado"
    exit 1
fi

# Verificar status do Minikube
if minikube status > /dev/null 2>&1; then
    print_success "Minikube está rodando"
    echo "    Perfil: $(minikube profile)"
    echo "    IP: $(minikube ip)"
else
    print_warning "Minikube não está rodando"
fi

echo ""
echo "=== Verificação do kubectl ==="

# Verificar se o kubectl está instalado
if command -v kubectl > /dev/null 2>&1; then
    print_success "kubectl está instalado: $(kubectl version --client --short 2>/dev/null || kubectl version --client)"
else
    print_error "kubectl não está instalado"
    exit 1
fi

# Verificar contexto do kubectl
if kubectl cluster-info > /dev/null 2>&1; then
    print_success "kubectl conectado ao cluster"
    echo "    Contexto: $(kubectl config current-context)"
else
    print_warning "kubectl não consegue conectar ao cluster"
fi

echo ""
echo "=== Recomendações ==="

if [ "$NEED_SUDO_DOCKER" = true ]; then
    print_info "Use o script 'deploy-smart.sh' que detecta automaticamente quando usar sudo"
    print_info "Ou execute os comandos para adicionar seu usuário ao grupo docker:"
    echo "    sudo usermod -aG docker \$USER"
    echo "    newgrp docker"
    echo "    # Ou reinicie sua sessão"
else
    print_success "Sua configuração está pronta! Use qualquer script de deploy."
fi

echo ""
echo "=== Comandos de Deploy Disponíveis ==="
echo "• ./deploy.sh         - Deploy padrão (pode precisar de sudo)"
echo "• ./deploy-smart.sh   - Deploy inteligente (detecta permissões)"
echo "• ./status.sh         - Verificar status dos recursos"
echo "• ./cleanup.sh        - Limpar todos os recursos"