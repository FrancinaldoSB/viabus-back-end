#!/bin/bash

# Script para configurar permissões Docker automaticamente
# Autor: GitHub Copilot

echo "🔧 Configurando permissões Docker..."

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

# Verificar se o usuário já está no grupo docker
if groups | grep -q docker; then
    print_success "Usuário já está no grupo docker!"
    echo ""
    print_info "Você pode usar qualquer script de deploy:"
    echo "• ./deploy.sh"
    echo "• ./deploy-smart.sh"
    exit 0
fi

print_warning "Usuário não está no grupo docker"
print_info "Adicionando usuário ao grupo docker..."

# Adicionar usuário ao grupo docker
if sudo usermod -aG docker $USER; then
    print_success "Usuário adicionado ao grupo docker com sucesso!"
    echo ""
    print_warning "IMPORTANTE: Você precisa fazer uma das seguintes ações:"
    echo ""
    echo "Opção 1 - Recarregar grupo (temporário para esta sessão):"
    echo "    newgrp docker"
    echo ""
    echo "Opção 2 - Reiniciar sessão (recomendado):"
    echo "    Faça logout e login novamente"
    echo "    Ou reinicie o terminal"
    echo ""
    print_info "Após isso, você poderá usar Docker sem sudo!"
    
    echo ""
    print_info "Para testar imediatamente, execute:"
    echo "    newgrp docker"
    echo "    ./scripts/deploy-smart.sh"
else
    print_error "Falha ao adicionar usuário ao grupo docker"
    exit 1
fi