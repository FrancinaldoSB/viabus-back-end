# Multi-stage build para otimizar o tamanho da imagem final
# Stage 1: Build
FROM node:20-alpine AS builder

# Instalar dependências necessárias
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production

# Instalar netcat para wait-for-it (usando busybox que já tem nc)
RUN apk add --no-cache curl

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

WORKDIR /app

# Copiar apenas arquivos necessários do stage anterior
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./

# Copiar wait-for-postgres script
COPY --chown=nestjs:nodejs wait-for-postgres.sh ./wait-for-postgres.sh
RUN chmod +x wait-for-postgres.sh

# Expor porta da aplicação
EXPOSE 4000

# Mudar para usuário não-root
USER nestjs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node dist/health-check.js || exit 1

# Comando para iniciar a aplicação
CMD ["sh", "-c", "./wait-for-postgres.sh postgres-service 5432 60 && node dist/main"]