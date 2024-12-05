
# ViaBus API

Bem-vindo à API do ViaBus! Esta API serve como a interface de programação necessária entre o front-end, desenvolvido em Next.js, e o banco de dados PostgreSQL no back-end. Agora, a API foi migrada para o **Spring Boot**, garantindo robustez, escalabilidade e maior integração com o ecossistema Java.

## Sumário

- [Introdução](#introdução)
- [Arquitetura](#arquitetura)
- [Banco de Dados](#banco-de-dados)
- [Instalação](#instalação)
- [Rotas](#rotas)
- [Autenticação](#autenticação)

## Introdução

A API do ViaBus foi projetada para fornecer uma interface eficiente e fácil de usar para o gerenciamento das funcionalidades do sistema de transporte de passageiros. Ela permite a manipulação de dados como usuários, rotas de ônibus, horários, paradas, e muito mais.

Com a migração para o **Spring Boot**, a API agora se beneficia de uma infraestrutura altamente configurável e um ecossistema poderoso que suporta integrações e monitoramento avançados.

## Arquitetura

A arquitetura desta API segue um padrão RESTful, proporcionando uma forma padronizada de interação com os recursos do sistema. As principais tecnologias utilizadas são:

- **[Spring Boot](https://spring.io/projects/spring-boot)**: Framework Java para o desenvolvimento de aplicações web robustas e escaláveis.
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

Front-end (Next.js) <--> API (Spring Boot) <--> Banco de Dados (PostgreSQL)

## Instalação

### Pré-requisitos

- Java 17 ou superior
- Maven 3.8+
- PostgreSQL 16
- Node.js (para o front-end)

### Passos para Instalação

1. Clone o repositório:
   ```bash
   git@github.com:ViaBus/viabus-back-end.git
   ```
2. Instale as dependências do projeto Java:
   ```bash
   mvn clean install
   ```
3. Configure o arquivo `application.properties` com as credenciais do banco de dados no diretório `src/main/resources`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/viabus
   spring.datasource.username=seu_usuario
   spring.datasource.password=sua_senha
   ```
4. Execute o projeto:
   ```bash
   mvn spring-boot:run
   ```
5. Acesse a API em `http://localhost:8080`.

## Rotas

### Usuários (/users)

Estas rotas gerenciam informações dos usuários, incluindo endereços, telefones e funções.

- **GET /users**: Retorna uma lista de todos os usuários.
- **GET /users/{id}**: Retorna um usuário específico pelo seu ID.
- **POST /users**: Cria um novo usuário.
- **PUT /users/{id}**: Atualiza os dados de um usuário específico.
- **DELETE /users/{id}**: Remove um usuário.

**Relacionadas:**

- **GET /users/{id}/address**: Retorna o endereço do usuário.
- **POST /users/{id}/address**: Cria um endereço para o usuário.
- **PUT /users/{id}/address**: Atualiza o endereço do usuário.
- **GET /users/{id}/phones**: Retorna os telefones do usuário.
- **POST /users/{id}/phones**: Adiciona um telefone para o usuário.
- **DELETE /users/{id}/phones/{phone_id}**: Remove um telefone específico do usuário.
- **GET /users/{id}/roles**: Retorna os papéis (roles) associados ao usuário.
- **POST /users/{id}/roles**: Adiciona um papel para o usuário.

### Tickets (/tickets)

Rotas para gerenciamento de tickets, incluindo informações de pagamento.

- **GET /tickets**: Retorna todos os tickets.
- **GET /tickets/{id}**: Retorna informações de um ticket específico.
- **POST /tickets**: Cria um novo ticket.
- **PUT /tickets/{id}**: Atualiza um ticket específico.
- **DELETE /tickets/{id}**: Remove um ticket.

**Relacionadas:**

- **GET /tickets/{id}/payment**: Retorna informações de pagamento de um ticket.
- **POST /tickets/{id}/payment**: Realiza o pagamento de um ticket.

### Paradas (/stops)

Gerenciamento de paradas e endereços de paradas.

- **GET /stops**: Retorna todas as paradas.
- **GET /stops/{id}**: Retorna uma parada específica.
- **POST /stops**: Cria uma nova parada.
- **PUT /stops/{id}**: Atualiza uma parada.
- **DELETE /stops/{id}**: Remove uma parada.

**Relacionadas:**

- **GET /stops/{id}/address**: Retorna o endereço da parada.
- **POST /stops/{id}/address**: Cria um endereço para a parada.
- **PUT /stops/{id}/address**: Atualiza o endereço da parada.

### Rotas (/routes)

Gerenciamento de rotas de viagem.

- **GET /routes**: Retorna todas as rotas disponíveis.
- **GET /routes/{id}**: Retorna informações de uma rota específica.
- **POST /routes**: Cria uma nova rota.
- **PUT /routes/{id}**: Atualiza uma rota.
- **DELETE /routes/{id}**: Remove uma rota.

**Relacionadas:**

- **GET /routes/{id}/stops**: Retorna todas as paradas associadas a uma rota.
- **POST /routes/{id}/stops**: Adiciona uma parada a uma rota, especificando a ordem.
- **GET /routes/{id}/schedule**: Retorna a agenda (horário) da rota.
- **POST /routes/{id}/schedule**: Cria ou atualiza a agenda da rota.

### Viagens (/trips)

Gerenciamento de viagens associadas a uma rota.

- **GET /trips**: Retorna todas as viagens.
- **GET /trips/{id}**: Retorna uma viagem específica.
- **POST /trips**: Cria uma nova viagem.
- **PUT /trips/{id}**: Atualiza uma viagem existente.
- **DELETE /trips/{id}**: Remove uma viagem.

### Preços de Rota (/route-prices)

Gerenciamento dos preços entre as paradas de origem e destino.

- **GET /route-prices**: Retorna todos os preços das rotas.
- **GET /route-prices/{id}**: Retorna um preço específico de rota.
- **POST /route-prices**: Cria um novo preço para uma rota (incluindo parada de origem e destino).
- **PUT /route-prices/{id}**: Atualiza um preço específico de rota.
- **DELETE /route-prices/{id}**: Remove um preço específico de rota.

## Autenticação

O sistema de autenticação permanece o mesmo, utilizando OAuth 2.0 via Google e JSON Web Tokens (JWT), com a API Spring Boot lidando com a verificação e autorização.