# 🚀 CONFIGURAR BANCO NO EASYPANEL - PASSO A PASSO

## 📋 PASSO 1: Criar Serviço PostgreSQL no Easypanel

### 1.1 Acessar Easypanel
1. Acesse seu Easypanel
2. Vá no projeto `sistema_escola` (ou crie um novo projeto)

### 1.2 Criar PostgreSQL
1. Clique em **"+ Serviço"** ou **"Add Service"**
2. Selecione **"Postgres"** ou **"PostgreSQL"**
3. Preencha os campos:

```
Nome do Serviço: sistema-adv-db
Nome do Banco de Dados: sistema_escola
Usuário: postgres
Senha: (escolha uma senha forte, ex: SuaSenhaForte123!)
Imagem Docker: postgres:17 (ou deixe padrão)
```

4. Clique em **"Criar"** ou **"Create"**
5. Aguarde o serviço iniciar (fica verde quando pronto)

---

## 📋 PASSO 2: Executar SQL no PostgreSQL do Easypanel

### 2.1 Acessar Terminal do PostgreSQL

**Opção A: Via Interface do Easypanel**
1. No Easypanel, clique no serviço **sistema-adv-db**
2. Vá na aba **"Terminal"** ou **"Console"**
3. Clique em **"Connect"** ou **"Conectar"**

**Opção B: Via Terminal Local**
1. Copie o comando de conexão que o Easypanel fornece
2. Cole no seu terminal local

### 2.2 Conectar ao Banco

No terminal do PostgreSQL, execute:

```bash
psql -U postgres -d sistema_escola
```

Digite a senha quando solicitado.

### 2.3 Executar o Script SQL

**Método 1: Copiar e Colar (RECOMENDADO)**

1. Abra o arquivo `criar-banco-easypanel.sql` (vou criar agora)
2. Copie TODO o conteúdo
3. Cole no terminal do PostgreSQL
4. Pressione Enter
5. Aguarde a execução

**Método 2: Upload de Arquivo**

Se o Easypanel permitir upload:
1. Faça upload do arquivo `criar-banco-easypanel.sql`
2. Execute: `\i criar-banco-easypanel.sql`

---

## 📋 PASSO 3: Verificar se Criou Corretamente

No terminal do PostgreSQL, execute:

```sql
-- Listar tabelas
\dt

-- Deve mostrar:
-- users
-- clients
-- processes
-- documents
-- appointments
-- notes

-- Verificar usuário admin
SELECT email, full_name, role FROM users;

-- Deve mostrar:
-- admin@sistema.com | Administrador do Sistema | admin
```

---

## 📋 PASSO 4: Criar/Configurar Aplicação Next.js

### 4.1 Criar Aplicação (se ainda não criou)

1. No Easypanel, clique em **"+ Aplicação"** ou **"Add App"**
2. Selecione **"GitHub"**
3. Conecte ao repositório: `https://github.com/Wiisite/adv`
4. Escolha a branch: `master`

### 4.2 Configurar Variáveis de Ambiente

Na aba **"Environment"** ou **"Variáveis de Ambiente"**, adicione:

```env
POSTGRES_HOST=sistema-adv-db
POSTGRES_PORT=5432
POSTGRES_DB=sistema_escola
POSTGRES_USER=postgres
POSTGRES_PASSWORD=SuaSenhaForte123!
JWT_SECRET=adv-sistema-jwt-secret-2024-change-in-production
NODE_ENV=production
```

**⚠️ IMPORTANTE:**
- `POSTGRES_HOST` deve ser o **nome do serviço PostgreSQL** que você criou
- `POSTGRES_PASSWORD` deve ser a **mesma senha** que você definiu ao criar o PostgreSQL
- `POSTGRES_DB` deve ser `sistema_escola` (ou o nome que você escolheu)

### 4.3 Configurar Build

```
Build Command: npm run build
Start Command: (deixe vazio - Dockerfile cuida)
Port: 3000
```

### 4.4 Deploy

1. Clique em **"Deploy"**
2. Aguarde o build (3-5 minutos)
3. Verifique os logs até aparecer: `✓ Ready in XXms`

---

## 📋 PASSO 5: Testar

### 5.1 Health Check

Acesse:
```
https://seu-dominio.easypanel.host/api/health
```

Deve retornar:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-03-25..."
}
```

### 5.2 Acessar Sistema

```
https://seu-dominio.easypanel.host
```

### 5.3 Fazer Login

```
Email: admin@sistema.com
Senha: admin123
```

---

## ❓ PROBLEMAS COMUNS NO EASYPANEL

### Erro: "password authentication failed"
**Solução:**
- Verifique se a senha nas variáveis de ambiente está correta
- Verifique se é a mesma senha do PostgreSQL

### Erro: "could not translate host name"
**Solução:**
- Verifique se `POSTGRES_HOST` é o nome EXATO do serviço PostgreSQL
- Deve ser algo como `sistema-adv-db` (sem http://, sem porta)

### Erro: "database sistema_escola does not exist"
**Solução:**
- Verifique se você criou o banco com o nome correto
- Execute o script SQL novamente

### Erro 500 no /api/health
**Solução:**
- Verifique os logs da aplicação no Easypanel
- Provavelmente é problema de conexão com o banco
- Verifique todas as variáveis de ambiente

---

## 🔄 FLUXO COMPLETO RESUMIDO

```
1. Criar PostgreSQL no Easypanel
   ↓
2. Conectar ao terminal do PostgreSQL
   ↓
3. Executar criar-banco-easypanel.sql
   ↓
4. Verificar tabelas criadas (\dt)
   ↓
5. Criar/Configurar aplicação Next.js
   ↓
6. Adicionar variáveis de ambiente
   ↓
7. Deploy
   ↓
8. Testar /api/health
   ↓
9. Acessar sistema e fazer login
```

---

## 📊 CHECKLIST

- [ ] PostgreSQL criado no Easypanel
- [ ] Senha do PostgreSQL anotada
- [ ] Conectado ao terminal do PostgreSQL
- [ ] Script SQL executado
- [ ] Tabelas verificadas com \dt
- [ ] Usuário admin verificado
- [ ] Aplicação criada/configurada
- [ ] Variáveis de ambiente adicionadas
- [ ] Deploy realizado
- [ ] /api/health retorna "ok"
- [ ] Login funcionando

---

**Siga este guia passo a passo e seu sistema estará funcionando no Easypanel!** 🚀
