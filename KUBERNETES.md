# ViaBus API - Deploy no Kubernetes (Minikube)

Este guia explica como fazer o deploy da aplicação ViaBus API no Kubernetes usando Minikube.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Docker](https://docs.docker.com/get-docker/)
- [Minikube](https://minikube.sigs.k8s.io/docs/start/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)

### ⚙️ Configuração de Permissões

**Para verificar sua configuração:**
```bash
./scripts/check-setup.sh
```

**Se você precisar configurar permissões Docker:**
```bash
./scripts/setup-docker.sh
```

Este script adicionará seu usuário ao grupo docker automaticamente.

## 🚀 Deploy Rápido

**Primeira vez?** Execute primeiro o script de verificação:
```bash
./scripts/check-setup.sh
```

Para fazer o deploy completo da aplicação, você tem duas opções:

**Opção 1 - Deploy Inteligente (Recomendado):**
```bash
./scripts/deploy-smart.sh
```

**Opção 2 - Deploy Padrão:**
```bash
./scripts/deploy.sh
```

Os scripts irão:
- ✅ Verificar se o Minikube está rodando
- ✅ Configurar o Docker para usar o daemon do Minikube  
- ✅ Fazer build da imagem Docker (com ou sem sudo conforme necessário)
- ✅ Habilitar os addons necessários (ingress)
- ✅ Aplicar todos os manifests do Kubernetes
- ✅ Aguardar os pods ficarem prontos

## 📁 Estrutura dos Arquivos

```
k8s/
├── configmap.yaml    # Variáveis de ambiente não-sensíveis
├── secrets.yaml      # Variáveis de ambiente sensíveis (senhas, tokens)
├── postgres.yaml     # Database PostgreSQL
├── deployment.yaml   # Deployment e Service da API
├── migration-job.yaml # Job para executar migrações automaticamente
└── ingress.yaml      # Ingress para exposição externa

scripts/
├── check-setup.sh    # Verificação de configuração e permissões
├── deploy.sh         # Script principal de deploy
├── deploy-smart.sh   # Deploy com detecção inteligente de permissões
├── cleanup.sh        # Script para limpeza dos recursos
├── status.sh         # Script para monitoramento
├── migrate.sh        # Script para executar migrações
└── test-db.sh        # Script para testar conectividade do banco
```

## 🔧 Scripts Disponíveis

### Verificar configuração
```bash
./scripts/check-setup.sh
```

### Deploy da aplicação
```bash
# Opção 1: Deploy inteligente (detecta permissões automaticamente)
./scripts/deploy-smart.sh

# Opção 2: Deploy padrão
./scripts/deploy.sh
```

### Executar migrações do banco
```bash
./scripts/migrate.sh
```

### Testar conectividade do banco
```bash
./scripts/test-db.sh
```

### Verificar status dos recursos
```bash
./scripts/status.sh
```

### Limpeza completa dos recursos
```bash
./scripts/cleanup.sh
```

## 🌐 Acessando a Aplicação

### Opção 1: Via Ingress (Recomendado)

1. Obtenha o IP do Minikube:
```bash
minikube ip
```

2. Adicione ao seu arquivo `/etc/hosts`:
```bash
echo "$(minikube ip) viabus-api.local" | sudo tee -a /etc/hosts
```

3. Acesse a aplicação em: http://viabus-api.local

### Opção 2: Via Port Forward

```bash
kubectl port-forward service/viabus-api-service 4000:4000
```

Acesse em: http://localhost:4000

### Opção 3: Via NodePort

```bash
minikube service viabus-api-service --url
```

## 🏥 Health Check

Verifique se a aplicação está funcionando:

```bash
curl http://viabus-api.local/health
# ou
curl http://localhost:4000/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "timestamp": "2025-09-23T...",
  "uptime": 123.456,
  "message": "Service is running"
}
```

## 🗃️ Banco de Dados

### Configuração
- **Database:** PostgreSQL 15
- **Nome do DB:** viabus
- **Usuário:** postgres
- **Senha:** admin (configurada via Secret)

### Executar Migrações
```bash
./scripts/migrate.sh
```

### Conectar diretamente ao banco
```bash
kubectl exec -it $(kubectl get pods -l app=postgres -o jsonpath='{.items[0].metadata.name}') -- psql -U postgres -d viabus
```

## 📊 Monitoramento

### Ver logs da aplicação
```bash
kubectl logs -f -l app=viabus-api
```

### Ver logs do PostgreSQL
```bash
kubectl logs -f -l app=postgres
```

### Status detalhado
```bash
kubectl get all
```

## 🔧 Configuração Avançada

### Variáveis de Ambiente

As configurações estão divididas em:

**ConfigMap** (`k8s/configmap.yaml`):
- DB_HOST, DB_PORT, DB_USERNAME, DB_DATABASE
- PORT, CORS_ORIGIN, JWT_EXPIRES_IN, NODE_ENV

**Secret** (`k8s/secrets.yaml`):
- DB_PASSWORD, JWT_SECRET

### Recursos Alocados

**API Pods:**
- Requests: 256Mi RAM, 250m CPU
- Limits: 512Mi RAM, 500m CPU
- Replicas: 2

**PostgreSQL Pod:**
- Requests: 256Mi RAM, 250m CPU  
- Limits: 512Mi RAM, 500m CPU
- Storage: 5Gi (Persistent Volume)

### Scaling

Para escalar a aplicação:
```bash
kubectl scale deployment viabus-api --replicas=3
```

## 🛠️ Troubleshooting

### Problemas de Conexão com Banco de Dados

**Erro: `connect ECONNREFUSED`**

Este erro indica que a aplicação não consegue conectar ao PostgreSQL. Soluções implementadas:

1. **Init Containers**: Aguarda PostgreSQL estar pronto antes de iniciar a aplicação
2. **Wait-for-it**: Script que testa conectividade antes de iniciar
3. **Startup Probes**: Dá mais tempo para a aplicação inicializar
4. **Job de Migração**: Executa migrações separadamente

**Para diagnosticar:**
```bash
# Testar conectividade do banco
./scripts/test-db.sh

# Ver logs dos pods
kubectl logs -l app=viabus-api
kubectl logs -l app=postgres

# Verificar status completo
./scripts/status.sh
```

### Pod não está iniciando
```bash
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

### Problemas de rede
```bash
kubectl get endpoints
kubectl describe service viabus-api-service
```

### Verificar recursos
```bash
kubectl top nodes
kubectl top pods
```

### Resetar completamente
```bash
./scripts/cleanup.sh
minikube delete
minikube start
./scripts/deploy.sh
```

## 🏗️ Build Local da Imagem

Para fazer build manual da imagem:

```bash
# Configurar Docker para usar daemon do Minikube
eval $(minikube docker-env)

# Build da imagem
docker build -t viabus-api:latest .

# Verificar imagem
docker images | grep viabus-api
```

## 📝 Notas Importantes

1. **Dados Persistentes**: O PostgreSQL usa um PersistentVolume que mantém os dados mesmo com restart dos pods.

2. **Secrets**: As senhas estão em base64 no arquivo `secrets.yaml`. Para produção, considere usar ferramentas como Helm ou Kustomize para gerenciar secrets de forma mais segura.

3. **SSL**: Para produção, configure certificados TLS no Ingress.

4. **Backup**: Configure backup automático do banco de dados para produção.

5. **Monitoring**: Para produção, considere adicionar Prometheus e Grafana para monitoramento.

## 🤝 Contribuindo

Para contribuir com melhorias no deploy:

1. Teste suas mudanças localmente
2. Atualize a documentação se necessário
3. Verifique se os scripts funcionam corretamente

---

**Criado por:** GitHub Copilot  
**Data:** 23 de setembro de 2025