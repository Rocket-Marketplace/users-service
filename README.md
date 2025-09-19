# Users Service

Microserviço responsável pelo gerenciamento de usuários (vendedores e compradores) e autenticação do marketplace.

## Funcionalidades

- Registro e login de usuários
- Gerenciamento de perfis de usuário
- Autenticação JWT
- Controle de roles (vendedor/comprador)
- Validação de senhas seguras
- API REST com documentação Swagger

## Tecnologias

- NestJS
- TypeORM
- PostgreSQL
- JWT (JSON Web Tokens)
- bcryptjs (hash de senhas)
- Swagger/OpenAPI
- Jest (testes)

## Instalação

```bash
npm install
```

## Configuração

Configure as variáveis de ambiente:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=users_db
PORT=3002
JWT_SECRET=your-secret-key
NODE_ENV=development
```

## Execução

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run start:prod
```

## Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

## API Endpoints

### Autenticação

- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Login do usuário
- `POST /auth/change-password` - Alterar senha (autenticado)

### Usuários

- `GET /users` - Listar usuários com paginação e filtros
- `GET /users/sellers` - Listar vendedores ativos
- `GET /users/:id` - Buscar usuário por ID
- `PATCH /users/:id` - Atualizar perfil do usuário
- `DELETE /users/:id` - Deletar usuário (soft delete)
- `PATCH /users/:id/status` - Atualizar status do usuário (admin)

### Documentação

Acesse a documentação Swagger em: `http://localhost:3002/api`

## Estrutura do Projeto

```
src/
├── users/
│   ├── entities/
│   │   └── user.entity.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── auth/
│   ├── guards/
│   │   └── jwt-auth.guard.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── common/
│   └── dto/
│       ├── create-user.dto.ts
│       ├── update-user.dto.ts
│       ├── login.dto.ts
│       ├── change-password.dto.ts
│       └── user-query.dto.ts
├── config/
│   └── database.config.ts
├── app.module.ts
└── main.ts
```

## Modelo de Dados

### User

- `id`: UUID (chave primária)
- `email`: Email único do usuário
- `password`: Hash da senha
- `firstName`: Nome do usuário
- `lastName`: Sobrenome do usuário
- `phone`: Telefone (opcional)
- `role`: Role do usuário (seller/buyer)
- `status`: Status do usuário (active/inactive/pending)
- `address`: Endereço (opcional)
- `city`: Cidade (opcional)
- `state`: Estado (opcional)
- `postalCode`: Código postal (opcional)
- `country`: País (opcional)
- `emailVerificationToken`: Token de verificação de email
- `passwordResetToken`: Token de reset de senha
- `passwordResetExpires`: Expiração do token de reset
- `lastLogin`: Último login
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização

## Roles de Usuário

- **BUYER**: Comprador - pode comprar produtos
- **SELLER**: Vendedor - pode vender produtos

## Status de Usuário

- **ACTIVE**: Usuário ativo
- **INACTIVE**: Usuário inativo
- **PENDING**: Usuário pendente de aprovação

## Autenticação

O serviço utiliza JWT (JSON Web Tokens) para autenticação. Para acessar endpoints protegidos, inclua o token no header:

```
Authorization: Bearer <token>
```

## Validações de Senha

- Mínimo 6 caracteres
- Máximo 50 caracteres
- Deve conter pelo menos:
  - Uma letra minúscula
  - Uma letra maiúscula
  - Um número

## Filtros de Busca

- `search`: Busca por nome, sobrenome ou email
- `role`: Filtro por role (seller/buyer)
- `status`: Filtro por status (active/inactive/pending)
- `page`/`limit`: Paginação

## Segurança

- Senhas são hasheadas com bcryptjs
- Tokens JWT com expiração de 24 horas
- Validação de dados de entrada
- Proteção contra ataques de força bruta
- Soft delete para preservar dados