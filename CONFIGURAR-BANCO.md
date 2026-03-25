# 🗄️ CONFIGURAR BANCO DE DADOS

## 📋 PASSO 1: Criar Banco de Dados Local (Para Testes)

### Opção A: Usando pgAdmin

1. Abra o **pgAdmin**
2. Conecte ao servidor PostgreSQL local
3. Clique com botão direito em **Databases** → **Create** → **Database**
4. Nome: `adv`
5. Clique em **Save**

### Opção B: Usando linha de comando

```bash
# Abra o terminal do PostgreSQL (SQL Shell / psql)
# Conecte como postgres
# Depois execute:
CREATE DATABASE adv;
```

---

## 📋 PASSO 2: Criar Tabelas

### Opção A: Usando pgAdmin

1. No pgAdmin, clique no banco `adv`
2. Clique em **Tools** → **Query Tool**
3. Copie todo o conteúdo do arquivo `setup-database.sql`
4. Cole na Query Tool
5. Clique em **Execute** (F5)

### Opção B: Usando arquivo SQL

1. Abra o terminal na pasta do projeto
2. Execute:
```bash
psql -U postgres -d adv -f setup-database.sql
```

---

## 📋 PASSO 3: Criar Arquivo .env.local

Crie um arquivo chamado `.env.local` na raiz do projeto com:

```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=adv
POSTGRES_USER=postgres
POSTGRES_PASSWORD=SUA_SENHA_AQUI
JWT_SECRET=adv-sistema-jwt-secret-2024-change-in-production
NODE_ENV=development
```

**⚠️ IMPORTANTE:** Substitua `SUA_SENHA_AQUI` pela senha do seu PostgreSQL local.

---

## 📋 PASSO 4: Testar Conexão

1. Abra o terminal na pasta do projeto
2. Execute:
```bash
npm run dev
```

3. Acesse no navegador:
```
http://localhost:3000/api/health
```

4. Deve retornar:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-03-25..."
}
```

---

## 🚀 PASSO 5: Testar Sistema

1. Acesse: `http://localhost:3000`
2. Clique em qualquer card do dashboard
3. Teste criar um cliente, processo, etc.

**Credenciais de login:**
- Email: `admin@sistema.com`
- Senha: `admin123`

---

## 🌐 DEPLOY NO EASYPANEL

Depois que funcionar localmente, para fazer deploy no Easypanel:

### 1. Criar Serviço PostgreSQL no Easypanel

- Nome: `sistema-adv-db`
- Database: `adv`
- User: `postgres`
- Password: (escolha uma senha forte)

### 2. Executar SQL no Easypanel

Use o terminal do PostgreSQL no Easypanel para executar o `setup-database.sql`

### 3. Configurar Variáveis de Ambiente na Aplicação

```env
POSTGRES_HOST=sistema-adv-db
POSTGRES_PORT=5432
POSTGRES_DB=adv
POSTGRES_USER=postgres
POSTGRES_PASSWORD=senha_que_voce_escolheu
JWT_SECRET=adv-sistema-jwt-secret-2024-change-in-production
NODE_ENV=production
```

### 4. Deploy

Faça commit e push para o GitHub. O Easypanel fará rebuild automático.

---

## ❓ PROBLEMAS COMUNS

### Erro: "password authentication failed"
- Verifique a senha do PostgreSQL no arquivo `.env.local`
- Senha padrão do PostgreSQL geralmente é `postgres`

### Erro: "database adv does not exist"
- Execute o PASSO 1 para criar o banco de dados

### Erro: "relation clients does not exist"
- Execute o PASSO 2 para criar as tabelas

### Porta 3000 já em uso
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <numero_do_pid> /F

# Ou simplesmente use outra porta
npm run dev -- -p 3001
```

---

## 📊 VERIFICAR SE ESTÁ TUDO OK

Execute no PostgreSQL:

```sql
-- Conectar ao banco adv
\c adv

-- Listar todas as tabelas
\dt

-- Deve mostrar:
-- users
-- clients
-- processes
-- documents
-- appointments

-- Verificar usuário admin
SELECT email, full_name, role FROM users;
```

---

**Siga estes passos e o sistema funcionará perfeitamente!** 🚀
