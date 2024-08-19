# ViaBus API

Bem-vindo à API do ViaBus! Esta API serve como a interface de programação necessária entre o front-end, desenvolvido em Next.js, e o banco de dados PostgreSQL no back-end. Ela é construída utilizando o framework Hono, garantindo alta performance e simplicidade no desenvolvimento.

## Sumário

- [Introdução](#introdução)
- [Arquitetura](#arquitetura)
- [Banco de Dados](#banco-de-dados)
- [Instalação](#instalação)
- [Rotas](#rotas)
- [Autenticação](#autenticação)

## Introdução

A API do ViaBus foi projetada para fornecer uma interface eficiente e fácil de usar para o gerenciamento das funcionalidades do sistema de transporte de passageiros. Ela permite a manipulação de dados como usuários, rotas de ônibus, horários, paradas, e muito mais.

## Arquitetura

A arquitetura desta API segue um padrão RESTful, proporcionando uma forma padronizada de interação com os recursos do sistema. As principais tecnologias utilizadas são:

- **[Hono](https://hono.dev/)**: Framework minimalista e rápido para criação de APIs.
- **[Next.js](https://nextjs.org/)**: Framework React para o desenvolvimento do front-end.
- **[PostgreSQL](https://www.postgresql.org/)**: Sistema de gerenciamento de banco de dados relacional robusto.

## Banco de Dados

A modelagem do banco de dados do ViaBus foi cuidadosamente planejada para garantir a eficiência e integridade dos dados. Abaixo, está o diagrama relacional que ilustra a estrutura das tabelas, seus relacionamentos e as principais entidades do sistema.

![Esquema Relacional - Viabus](https://github.com/user-attachments/assets/8ec2e5fc-f356-449a-9213-317b14c78c4b)

### Principais Entidades

- **User**: Tabela que armazena informações dos usuários do sistema, sejam clientes, administradores ou funcionários.
- **Ticket**: Tabela responsável por armazenar os registros de bilhetes comprados ou utilizados pelos usuários.
- **Route**: Representa as rotas de ônibus disponíveis no sistema.
- **Stop**: Tabela que armazena as paradas de ônibus, associadas às rotas.
- **Trip**: Contém os detalhes de cada viagem, vinculando rotas e horários específicos.

### Relacionamentos

- **One-to-Many**: Muitos dos relacionamentos no sistema seguem este padrão, como a relação entre `User` e `Ticket`, onde um usuário pode possuir vários tickets.
- **Many-to-Many**: Certas relações, como entre `Route` e `Stop`, são implementadas usando tabelas intermediárias para capturar o relacionamento de muitos para muitos.

O modelo foi implementado utilizando PostgreSQL.


### Diagrama Simplificado

Front-end (Next.js) <--> API (Hono) <--> Banco de Dados (PostgreSQL)


## Instalação

### Pré-requisitos

- Node.js 
- PostgreSQL 16
- Bun 1.1.21 

### Passos para Instalação

1. Clone o repositório:
   ```bash
   git@github.com:ViaBus/viabus-back-end.git
    ```
2. Instale as dependências:
    ```bash
    bun install
    ```
3. Crie um arquivo `.env` na raiz do projeto e adicione as variáveis de ambiente necessárias.
4. Execute o comando:
    ```bash
    bun run dev
    ```
5. Acesse a API em `http://localhost:3000`.

## Rotas

Para uma lista completa de rotas, consulte a documentação da API.

## Autenticação

O sistema de autenticação da API ViaBus foi implementado utilizando OAuth 2.0 via Google e JSON Web Tokens (JWT), proporcionando uma camada segura e eficiente de acesso.

### Visão Geral

A autenticação é realizada no front-end, desenvolvido com Next.js, utilizando a biblioteca `NextAuth.js`. O back-end, construído com Hono e Prisma, gerencia a verificação e criação dos usuários no banco de dados PostgreSQL.

### Fluxo de Autenticação

1. **Login com Google**:
   - O usuário inicia a autenticação clicando no botão de login com Google no front-end.
   - `NextAuth.js` gerencia a autenticação com o Google via `GoogleProvider`, obtendo o `id_token`.

2. **Verificação e Criação de Usuário**:
   - O front-end envia o `id_token` para a API do ViaBus.
   - A API verifica se o usuário já existe no banco de dados através do endpoint `/api/auth/check`.
     - Se o usuário for encontrado, ele é autenticado.
     - Se o usuário não existir, um novo registro é criado no banco de dados usando o endpoint `/api/auth/signup`.

3. **Sessão JWT**:
   - Um token JWT é gerado e incluído na sessão do usuário, permitindo autenticação em futuras interações com a API.

### Middleware de Autenticação de Usuário

O middleware `authenticatedUser` é utilizado para proteger rotas que devem ser acessíveis apenas por usuários autenticados. Ele valida o usuário com base nas informações da sessão e do banco de dados.

#### Funcionamento

1. **Verificação da Sessão**:
   - Extrai o email do usuário autenticado a partir do objeto `session`, que contém informações básicas obtidas do token JWT.

2. **Busca no Banco de Dados**:
   - Verifica no banco de dados se o usuário existe, utilizando o Prisma. Se o usuário não for encontrado, lança uma exceção `UnauthorizedError`.

3. **Configuração do Usuário Autenticado**:
   - Armazena o objeto completo do usuário encontrado no banco de dados em `authenticatedUser`, que pode ser acessado por outros middlewares ou controladores.

#### Diferença entre `session` e `authenticatedUser`

- **`session`**:
  - Contém informações básicas do usuário (nome, email, foto) extraídas do token JWT.
  - Usado para validação rápida do token.

- **`authenticatedUser`**:
  - Objeto mais completo com dados detalhados do usuário obtidos do banco de dados (inclui `role`, `id`, etc.).
  - Usado em rotas que requerem informações detalhadas e seguras do usuário.

### Endpoints de Autenticação

- **POST `/api/auth/check`**: Verifica se o usuário já existe no banco de dados utilizando o token JWT.
- **POST `/api/auth/signup`**: Cria um novo usuário no banco de dados, caso ele ainda não exista.

### Exemplos de Uso

**Verificação de Usuário:**

```bash
POST /api/auth/check
Authorization: Bearer <id_token>

Resposta:
{
  "ok": true,
  "message": "Usuário encontrado",
  "data": { ... }
}










