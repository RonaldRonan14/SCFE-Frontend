# Sistema de Controle Financeiro Empresarial (SCFE) - Frontend
Uma aplicação web moderna para controle financeiro de pequenas empresas. O frontend foi desenvolvido com Angular e é responsável por gerenciar receitas, despesas, organizar dados por categorias e gerar relatórios visuais e detalhados.

## Funcionalidades

-   **Login:** Sistema de autenticação de usuário para proteger o acesso à aplicação.
-   **Dashboard:** Visão geral com um resumo das transações, incluindo cards de receita, despesa e o saldo total.
-   **Transações:** Gerenciamento completo de transações (CRUD - Criar, Ler, Atualizar e Deletar)..
-   **Configurações:**
    -   **Categoria:** Interface para gerenciar as categorias que organizam as transações.
-   **Relatórios:**
    -   **Transações por categoria:** Relatório com saldo agrupado por categoria.

## Pré-requisitos
Para rodar este projeto, você precisa ter as seguintes ferramentas instaladas:

-   **Node.js: versão 18.x** ou superior.
-   **npm: versão 9.x** ou superior (geralmente já vem com o Node.js).
-   **Angular CLI:** Instale globalmente com o comando:
```
npm install -g @angular/cli
```
-   **Editor de Código: VS Code** ou outro de sua preferência.

## Configuração e Instalação
Siga os passos abaixo para configurar e executar a aplicação localmente.

### 1. Clone o Repositório

```bash
git clone https://github.com/RonaldRonan14/SCFE-Frontend
cd SCFE-Backend
```

### 2. Instalar Dependências
Instale todas as dependências do projeto com o npm.
``` 
npm install
```

### 3. Executar a Aplicação
Inicie o servidor de desenvolvimento do Angular.
```
ng serve
```
A aplicação estará disponível em seu navegador em `http://localhost:4200/`.

## Estrutura do Projeto
-   `src/app/auth`: Contém a lógica de autenticação, como serviços e guardas de rota.
-   `src/app/components`: Armazena componentes reutilizáveis, como botões, formulários e cards.
-   `src/app/enums`: Mapeamento dos enums usados na aplicação.
-   `src/app/layouts`: Define o layout das páginas principais.
-   `src/app/models`: Contém as interfaces e classes que modelam as entidades da API.
-   `src/app/pages`: Armazena os componentes de cada página completa da aplicação.
-   `src/app/services`: Responsável por toda a comunicação com a API (consumo e tratamento de retornos).
-   `src/app/util`: Funções e utilitários que podem ser compartilhados por toda a aplicação.

##   Projeto backend
Este repositório contém apenas o frontend da aplicação. Para ver e executar a API, confira o projeto **Backend** correspondente.

-   **Repositório Backend:** `https://github.com/RonaldRonan14/SCFE-Frontend`
