# ViaBus API

Bem-vindo à API do ViaBus! Esta API serve como a interface de programação necessária entre o front-end, desenvolvido em Next.js, e o banco de dados PostgreSQL no back-end. Ela é construída utilizando o framework Hono, garantindo alta performance e simplicidade no desenvolvimento.

## Sumário

- [Introdução](#introdução)
- [Arquitetura](#arquitetura)
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

### Diagrama Simplificado

Front-end (Next.js) <--> API (Hono) <--> Banco de Dados (PostgreSQL)


## Instalação

### Pré-requisitos

- Node.js 
- PostgreSQL 
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

A autenticação ainda não foi implementada na API, mas será feita utilizando JWT em futuras atualizações.









