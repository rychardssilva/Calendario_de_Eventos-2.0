# 🎟️ Sistema de Gerenciamento de Eventos

Este projeto é um sistema completo para gerenciamento de eventos, permitindo que **administradores criem e gerenciem eventos** e que **usuários participantes marquem interesse** nos eventos.  
O sistema é dividido em **backend (API)** e **frontend (React)**.

---

## **🚀 Tecnologias Utilizadas**

### **Backend**
- **Node.js** com **Express** – Servidor REST.
- **Prisma ORM** – Manipulação do banco de dados relacional (MySQL ou PostgreSQL).
- **JWT (JSON Web Token)** – Autenticação e controle de acesso.
- **bcrypt** – Criptografia de senhas.
- **Zod** – Validação de dados (create/update de eventos).
- **dotenv** – Configurações de ambiente.
- **CORS** – Permitir comunicação com o frontend.
- **Nodemon** – Hot reload no desenvolvimento.

### **Frontend**
- **React.js (Vite)** – Interface do usuário.
- **React Router** – Navegação entre páginas.
- **Tailwind CSS** – Estilização responsiva.
- **React Hook Form** – Controle de formulários.
- **Axios** – Requisições HTTP.
- **LocalStorage** – Armazenamento do token e dados do usuário.

---

## **⚙️ Funcionalidades Implementadas**

### **Backend**
- **Autenticação com JWT** (login e registro de usuários).
- **Middleware `verificarToken`** – Garante que apenas usuários autenticados acessem rotas protegidas.
- **Controle de permissões** (usuário comum vs. administrador).
- **CRUD de eventos (admin)** – Criar, listar, editar e excluir eventos.
- **Marcar e remover interesse em eventos** (usuários).
- **Contagem de interessados por evento**.
- **Listagem de eventos com paginação**.
- **Listar eventos em que o usuário marcou interesse**.
- **Detalhes de um evento específico**.

### **Frontend**
- **Páginas de Login e Registro** com autenticação.
- **Dashboard do Administrador** com:
  - Listagem de eventos.
  - Paginação.
  - Contador de pessoas interessadas.
  - Ações: Ver Detalhes, Editar (somente criador), Excluir (somente criador).
- **CreateEventPage** – Formulário para criar novos eventos.
- **Controle de navegação baseado no papel do usuário** (ADMIN ou PARTICIPANTE).
- **Armazenamento do token e role no LocalStorage**.

---

## **📌 Funcionalidades Faltando / Pendentes**
- **Frontend:**
  - Tela de **Editar Evento** (EditEventPage).
  - Botões de **“Tenho Interesse” / “Remover Interesse”** no Dashboard.
  - Página do **Participante (DashboardParticipant)** para listar eventos e gerenciar interesses.
  - Página para listar **interessados em um evento (somente admin)**.
  - Logout e proteção de rotas via **PrivateRoutes**.
  - Melhorar feedback de erros e sucesso (toasts ao invés de `alert`).

- **Backend:**
  - Middleware adicional para verificar se o usuário é o **criador do evento** antes de permitir edição ou exclusão.
  - Endpoint para listar **interessados em um evento** (para o admin).
  - Ajustar **refresh do token** no login (remover token anterior antes de salvar um novo).

---

## **📦 Como Rodar o Projeto**

### **1. Clone o repositório**
```bash
git clone https://github.com/SEU-USUARIO/seu-projeto.git
cd seu-projeto

Configurar o Backend
bash
Copiar
Editar

Configurar o Frontend
cd frontend
npm install
npm run dev
