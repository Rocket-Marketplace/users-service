# 👥 Users Service

Serviço responsável pelo gerenciamento de usuários, autenticação, autorização e sessões no marketplace. Este serviço fornece todas as funcionalidades necessárias para o sistema de identidade e acesso.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Execução](#execução)
- [Docker](#docker)
- [API Endpoints](#api-endpoints)
- [Contratos de Dados](#contratos-de-dados)
- [Monitoramento](#monitoramento)
- [Testes](#testes)
- [Deploy](#deploy)

## 🎯 Visão Geral

O Users Service é responsável por:

- **Gerenciamento de Usuários**: CRUD completo de usuários
- **Autenticação**: Login, registro e validação de credenciais
- **Autorização**: Controle de acesso baseado em roles
- **Sessões**: Gerenciamento de sessões de usuário
- **Segurança**: Criptografia de senhas e tokens JWT
- **Validação**: Validação de dados e regras de negócio
- **Auditoria**: Rastreamento de atividades de usuário

## 🏗️ Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Checkout Service│    │ Products Service│    │  Admin Panel    │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │      Users Service        │
                    │  ┌─────────────────────┐  │
                    │  │   User Management   │  │
                    │  │   Authentication    │  │
                    │  │   Session Control   │  │
                    │  │   Password Security │  │
                    │  │   Role Management   │  │
                    │  └─────────────────────┘  │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │      PostgreSQL           │
                    │    Users Database         │
                    └───────────────────────────┘
```

## ⚡ Funcionalidades

### 👤 Gerenciamento de Usuários
- **Registro**: Criação de novos usuários
- **Perfil**: Atualização de dados pessoais
- **Status**: Controle de status do usuário (active, inactive, suspended)
- **Roles**: Sistema de roles e permissões
- **Validação**: Validação de dados de entrada

### 🔐 Autenticação
- **Login**: Autenticação com email/senha
- **JWT**: Geração e validação de tokens
- **Senhas**: Criptografia com bcrypt
- **Validação**: Verificação de credenciais
- **Segurança**: Proteção contra ataques

### 🔑 Autorização
- **Roles**: Sistema de roles (user, admin, seller)
- **Permissões**: Controle granular de acesso
- **Guards**: Proteção de rotas
- **Middleware**: Validação de permissões

### 📱 Gestão de Sessões
- **Criação**: Criação de novas sessões
- **Validação**: Validação de tokens de sessão
- **Expiração**: Controle de expiração
- **Limpeza**: Limpeza automática de sessões expiradas
- **Rastreamento**: Log de atividades de sessão

### 🔒 Segurança
- **Criptografia**: Hash de senhas com bcrypt
- **Tokens**: JWT com expiração
- **Validação**: Validação rigorosa de dados
- **Auditoria**: Log de atividades de segurança

## 🛠️ Tecnologias

- **Framework**: NestJS 11.x
- **Linguagem**: TypeScript 5.x
- **Banco de Dados**: PostgreSQL 15
- **ORM**: TypeORM
- **Autenticação**: JWT + Passport
- **Criptografia**: bcryptjs
- **Validação**: class-validator + class-transformer
- **Documentação**: Swagger/OpenAPI
- **Monitoramento**: Prometheus + Grafana
- **Tracing**: OpenTelemetry + Jaeger
- **Containerização**: Docker + Docker Compose

## 📋 Pré-requisitos

- Node.js 18.x ou superior
- npm 9.x ou superior
- PostgreSQL 15
- Docker e Docker Compose (opcional)

## 🚀 Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd users-service
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Servidor
PORT=3000
NODE_ENV=development

# Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=users_db

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Sessões
SESSION_EXPIRES_IN=7d
MAX_SESSIONS_PER_USER=5

# Segurança
BCRYPT_ROUNDS=12
PASSWORD_MIN_LENGTH=8

# Serviços Externos
MESSAGING_SERVICE_URL=http://localhost:3005

# Monitoramento
JAEGER_ENDPOINT=http://localhost:14268/api/traces
PROMETHEUS_PORT=9090
```

### Configuração do Banco de Dados

1. **Crie o banco de dados**
```sql
CREATE DATABASE users_db;
```

2. **Execute as migrações**
```bash
npm run migration:run
```

## 🏃‍♂️ Execução

### Desenvolvimento

```bash
# Modo desenvolvimento com hot reload
npm run start:dev

# Modo debug
npm run start:debug

# Build e execução
npm run build
npm run start:prod
```

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev          # Inicia com watch mode
npm run start:debug        # Inicia em modo debug

# Build
npm run build              # Compila TypeScript
npm run start:prod         # Executa versão compilada

# Testes
npm run test               # Executa testes unitários
npm run test:watch         # Executa testes em watch mode
npm run test:cov           # Executa testes com coverage
npm run test:e2e           # Executa testes end-to-end

# Qualidade de Código
npm run lint               # Executa ESLint
npm run format             # Formata código com Prettier
```

## 🐳 Docker

### Docker Compose (Recomendado)

```bash
# Inicia todos os serviços
docker-compose up -d

# Inicia apenas o serviço
docker-compose up users-service

# Para os serviços
docker-compose down

# Rebuild da imagem
docker-compose up --build
```

### Docker Manual

```bash
# Build da imagem
docker build -t users-service .

# Executa o container
docker run -p 3000:3000 \
  -e DB_HOST=host.docker.internal \
  users-service
```

### Serviços Incluídos no Docker Compose

- **users-service**: Aplicação principal (porta 3000)
- **users-db**: PostgreSQL (porta 5433)
- **Prometheus**: Monitoramento (porta 9090)
- **Grafana**: Dashboards (porta 3000)

## 📡 API Endpoints

### 🔐 Autenticação

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/auth/register` | Registra novo usuário | ❌ |
| POST | `/auth/login` | Login do usuário | ❌ |
| POST | `/auth/change-password` | Altera senha | ✅ |

### 📱 Sessões

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/sessions` | Cria nova sessão | ✅ |
| GET | `/sessions/validate/:token` | Valida token de sessão | ❌ |
| DELETE | `/sessions/:token` | Invalida sessão | ❌ |
| POST | `/sessions/cleanup` | Limpa sessões expiradas | ❌ |

### 🏥 Health Check

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/health` | Status da aplicação |
| GET | `/health/ready` | Readiness probe |
| GET | `/health/live` | Liveness probe |

## 📊 Contratos de Dados

### CreateUserDto
```typescript
{
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: Date;
  role?: 'user' | 'admin' | 'seller';
}
```

### LoginDto
```typescript
{
  email: string;
  password: string;
}
```

### ChangePasswordDto
```typescript
{
  currentPassword: string;
  newPassword: string;
}
```

### User Entity
```typescript
{
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: Date;
  role: 'user' | 'admin' | 'seller';
  status: 'active' | 'inactive' | 'suspended';
  emailVerified: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Session Entity
```typescript
{
  id: string;
  userId: string;
  token: string;
  userAgent?: string;
  ipAddress?: string;
  expiresAt: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Auth Response
```typescript
{
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    status: string;
  };
  accessToken: string;
  sessionToken: string;
  expiresIn: number;
}
```

### Session Validation Response
```typescript
{
  valid: boolean;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    status: string;
  };
  session: {
    id: string;
    expiresAt: Date;
    createdAt: Date;
  };
}
```

## 📈 Monitoramento

### Métricas Prometheus

- `users_total`: Total de usuários cadastrados
- `users_by_role`: Usuários por role
- `users_by_status`: Usuários por status
- `auth_attempts_total`: Tentativas de autenticação
- `auth_successes_total`: Autenticações bem-sucedidas
- `auth_failures_total`: Falhas de autenticação
- `sessions_active`: Sessões ativas
- `sessions_expired`: Sessões expiradas

### Dashboards Grafana

Acesse: `http://localhost:3000`

- **Users Dashboard**: Métricas de usuários
- **Authentication Dashboard**: Métricas de autenticação
- **Sessions Dashboard**: Métricas de sessões

### Tracing Jaeger

Acesse: `http://localhost:16686`

- Traces de autenticação
- Performance analysis
- Security monitoring

## 🧪 Testes

### Executar Testes

```bash
# Testes unitários
npm run test

# Testes com coverage
npm run test:cov

# Testes end-to-end
npm run test:e2e

# Testes em watch mode
npm run test:watch
```

### Estrutura de Testes

```
test/
├── app.e2e-spec.ts          # Testes E2E
├── jest-e2e.json           # Configuração Jest E2E
src/
├── **/*.spec.ts            # Testes unitários
└── **/*.controller.spec.ts # Testes de controllers
```

### Testes de Integração

```bash
# Testa registro de usuário
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Testa login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Testa validação de sessão
curl http://localhost:3000/sessions/validate/session-token
```

## 🚀 Deploy

### Script de Deploy

```bash
# Executa o script de deploy
./deploy.sh
```

### Deploy Manual

```bash
# Build da aplicação
npm run build

# Executa migrações
npm run migration:run

# Inicia em produção
npm run start:prod
```

### Variáveis de Ambiente para Produção

```env
NODE_ENV=production
PORT=3000
DB_HOST=your-production-db-host
JWT_SECRET=your-production-secret
MESSAGING_SERVICE_URL=https://messaging.yourdomain.com
```

## 🔧 Troubleshooting

### Problemas Comuns

1. **Erro de conexão com banco**
   - Verifique se o PostgreSQL está rodando
   - Confirme as credenciais no `.env`

2. **Erro de autenticação**
   - Verifique o `JWT_SECRET`
   - Confirme se as credenciais estão corretas

3. **Sessão inválida**
   - Verifique se o token não expirou
   - Confirme se a sessão está ativa

4. **Erro de validação**
   - Verifique os dados de entrada
   - Confirme se os DTOs estão corretos

### Logs

```bash
# Logs da aplicação
docker-compose logs -f users-service

# Logs do banco
docker-compose logs -f users-db
```

## 🔐 Segurança

### Boas Práticas

1. **Senhas Seguras**
   - Use bcrypt para hash
   - Implemente política de senhas
   - Valide força da senha

2. **Tokens JWT**
   - Use chaves secretas fortes
   - Implemente expiração
   - Valide assinatura

3. **Sessões**
   - Limite número de sessões
   - Implemente expiração
   - Rastreie atividades

4. **Validação**
   - Valide todos os dados
   - Sanitize entradas
   - Use DTOs

## 📚 Documentação Adicional

- [Swagger UI](http://localhost:3000/api) - Documentação interativa da API
- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [JWT Documentation](https://jwt.io/)
- [bcrypt Documentation](https://www.npmjs.com/package/bcryptjs)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**Desenvolvido com ❤️ para o Marketplace API**