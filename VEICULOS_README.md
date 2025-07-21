# Módulo de Veículos - ViaBus (Modelagem Simplificada)

Este documento descreve o módulo de **Veículos** implementado no sistema ViaBus, que permite o cadastro e gerenciamento eficiente da frota de ônibus com uma modelagem simplificada e inovadora.

## 🚌 Funcionalidades

### Cadastro Completo de Veículos

- **Informações Básicas**: Placa, modelo, marca, ano
- **Capacidade**: Número de passageiros
- **Categoria Principal**: Van (Pequeno Porte), Micro-ônibus (Médio Porte), Ônibus (Grande Porte)
- **Configuração de Conforto**: Convencional, Executivo, Semi-Leito, Leito
- **Tipo de Ônibus** (apenas para Grande Porte): LD (Low Driver), DD (Double Decker)
- **Manutenção**: Controle de hodômetro, datas de manutenção
- **Data de Aquisição**: Controle de quando o veículo foi adquirido

### Modelagem Inovadora de Tipos

A nova modelagem utiliza uma estrutura hierárquica:

**Categoria Principal → Configuração de Conforto → Tipo de Ônibus (condicional)**

- **Pequeno Porte (Van)**: Veículos para transporte urbano de pequenas distâncias
- **Médio Porte (Micro-ônibus)**: Veículos intermediários para rotas específicas
- **Grande Porte (Ônibus)**: Veículos principais da frota
  - **LD (Low Driver)**: Configuração padrão de ônibus
  - **DD (Double Decker)**: Ônibus de dois andares

### Validação Condicional

- **Campo "Tipo de Ônibus"** só é obrigatório e visível quando a Categoria Principal for "Grande Porte"
- **Interface dinâmica** que se adapta às escolhas do usuário
- **Validação no backend** garante integridade dos dados

### Gestão de Status

- **Ativo**: Veículo em operação normal
- **Inativo**: Temporariamente fora de operação
- **Manutenção**: Em processo de manutenção
- **Fora de Serviço**: Permanentemente indisponível

### Funcionalidades Avançadas

- **Filtros Inteligentes**: Busca por placa, modelo, marca, categoria, configuração de conforto, tipo de ônibus, status
- **Dashboard com Estatísticas**: Visão geral da frota com contadores por status
- **Ações Rápidas**: Ativar/desativar, colocar em manutenção, atualizar hodômetro
- **Validações Robustas**: Formatos de placa brasileira

## 🏗️ Arquitetura

### Back-end (NestJS)

```
src/modules/vehicles/
├── entities/
│   └── vehicle.entity.ts          # Entity com enums para categoria, conforto e tipo
├── dto/
│   ├── create-vehicle.dto.ts      # Validação condicional para busType
│   ├── update-vehicle.dto.ts      # PartialType do CreateVehicleDto
│   └── query-vehicle.dto.ts       # Filtros de consulta
├── interfaces/
│   └── vehicle.interface.ts       # Interface de resposta
├── vehicle.service.ts             # Lógica de negócio com filtros
├── vehicle.controller.ts          # Endpoints REST
└── vehicle.module.ts              # Configuração do módulo
```

### Front-end (Next.js)

```
src/app/dashboard/[company]/veiculos/
├── components/
│   ├── vehicle-table.tsx          # Tabela com ações inline
│   ├── vehicle-form.tsx           # Formulário com lógica condicional
│   └── new-vehicle-dialog.tsx     # Modal para criação/edição
├── page.tsx                       # Página principal com filtros
└── types/vehicle.ts               # Tipos TypeScript
```

## 🛠️ Instalação e Configuração

### 1. Back-end

O módulo já está integrado ao `app.module.ts`. Para aplicar as mudanças no banco:

```bash
cd viabus-back-end

# Executar migração
npm run migration:run

# Ou executar manualmente o SQL da migração
```

### 2. Front-end

O módulo está integrado ao sidebar e pronto para uso. Acesse através de:

- Dashboard → Veículos

## 📊 Campos do Cadastro

### Obrigatórios

- **Placa**: Formato brasileiro (ABC1234 ou ABC1D23)
- **Modelo**: Nome do modelo do veículo
- **Marca**: Fabricante
- **Ano**: Entre 1980 e ano atual + 1
- **Capacidade**: Entre 1 e 300 passageiros
- **Categoria Principal**: Van, Micro-ônibus ou Ônibus
- **Configuração de Conforto**: Convencional, Executivo, Semi-Leito ou Leito
- **Tipo de Ônibus**: LD ou DD (apenas quando categoria = "Grande Porte")
- **Data de Aquisição**: Data de compra/aquisição

### Opcionais

- **Hodômetro**: Quilometragem atual
- **Última Manutenção**: Data da última manutenção realizada
- **Próxima Manutenção**: Data programada para próxima manutenção
- **Observações**: Notas adicionais

## 🔌 API Endpoints

### Veículos

```http
GET    /vehicles                    # Listar com filtros e paginação
POST   /vehicles                    # Criar novo veículo
GET    /vehicles/active             # Listar apenas ativos
GET    /vehicles/:id                # Buscar por ID
PATCH  /vehicles/:id                # Atualizar veículo
PATCH  /vehicles/:id/activate       # Ativar veículo
PATCH  /vehicles/:id/deactivate     # Desativar veículo
PATCH  /vehicles/:id/maintenance    # Colocar em manutenção
PATCH  /vehicles/:id/odometer       # Atualizar hodômetro
DELETE /vehicles/:id                # Excluir veículo
```

## 🎨 Interface do Usuário

### Dashboard

- **Cards de Estatísticas**: Total, Ativos, Em Manutenção, Inativos
- **Filtros Avançados**: 7 filtros diferentes para busca precisa
- **Tabela Responsiva**: Exibição otimizada para diferentes telas

### Formulário Dinâmico

- **Layout Responsivo**: Grade adaptável para desktop/mobile
- **Validação em Tempo Real**: Feedback imediato de erros
- **Campo Condicional**: "Tipo de Ônibus" aparece apenas para categoria "Grande Porte"
- **Limpeza Automática**: Remove busType quando categoria muda

### Ações

- **Menu de Contexto**: Ações específicas por status do veículo
- **Confirmações**: Diálogos de confirmação para ações críticas
- **Feedback Visual**: Toasts para sucesso/erro

## 🔧 Validação Condicional (Implementação)

### Backend (TypeORM + class-validator)

```typescript
@ValidateIf((o) => o.category === VehicleCategory.LARGE)
@IsEnum(BusType, {
  message: 'Tipo de ônibus é obrigatório para veículos de grande porte',
})
busType?: BusType;
```

### Frontend (React Hook Form + Zod)

```typescript
// Watch category to show/hide busType field
const watchedCategory = form.watch('category');
const isLargeCategory = watchedCategory === 'large';

// Clear busType when category is not large
useEffect(() => {
  if (!isLargeCategory) {
    form.setValue('busType', undefined);
  }
}, [isLargeCategory, form]);

// Conditional rendering
{isLargeCategory && (
  <FormField name="busType">
    {/* Bus type select */}
  </FormField>
)}
```

## 🗄️ Estrutura do Banco de Dados

### Enums

```sql
-- Categoria Principal
category ENUM('small', 'medium', 'large') DEFAULT 'medium'

-- Configuração de Conforto
comfort_configuration ENUM('conventional', 'executive', 'semi_sleeper', 'sleeper') DEFAULT 'conventional'

-- Tipo de Ônibus (condicional)
bus_type ENUM('ld', 'dd') NULLABLE

-- Status
status ENUM('active', 'inactive', 'maintenance', 'out_of_service') DEFAULT 'active'
```

## 🔒 Segurança

- **Autenticação**: Todas as rotas protegidas por JWT
- **Autorização**: Filtro automático por empresa (`@CompanyFilter`)
- **Validação**: Sanitização de dados com class-validator
- **Validação Condicional**: busType só aceito quando category = 'large'

## 📈 Vantagens da Nova Modelagem

### Simplicidade

- **Menos campos**: Removidos campos desnecessários (combustível, documentos, seguros)
- **Foco no essencial**: Apenas informações realmente necessárias para gestão

### Flexibilidade

- **Hierarquia lógica**: Categoria → Conforto → Tipo específico
- **Escalabilidade**: Fácil adição de novas categorias ou tipos

### UX Melhorada

- **Interface dinâmica**: Campos aparecem conforme necessário
- **Validação inteligente**: Regras condicionais claras
- **Menos confusão**: Usuário vê apenas o que é relevante

## 🐛 Troubleshooting

### Erros Comuns

1. **Placa inválida**: Verificar formato ABC1234 ou ABC1D23
2. **Ano inválido**: Entre 1980 e ano atual + 1
3. **Tipo de ônibus obrigatório**: Só para categoria "Grande Porte"
4. **Campo condicional**: busType deve ser limpo ao mudar categoria

### Logs

Verificar logs do servidor para detalhes de erros de validação ou banco de dados.

---

**Desenvolvido para o sistema ViaBus** 🚌✨
_Gestão eficiente de transporte urbano com modelagem simplificada e intuitiva_
