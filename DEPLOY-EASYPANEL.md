# 🚀 Deploy no Easypanel - Sistema de Advocacia V2

## ✅ Projeto Criado do Zero

Este é um projeto **completamente novo**, criado do zero sem os problemas do projeto anterior.

### **O que foi feito:**
- ✅ Next.js 14.2.4 instalado limpo
- ✅ PostgreSQL nativo configurado (sem Supabase)
- ✅ Autenticação com JWT e bcrypt
- ✅ Dockerfile otimizado seguindo documentação oficial
- ✅ Build testado localmente com SUCESSO

---

## 📋 PASSO 1: Criar Banco de Dados no Easypanel

### **1.1 Criar Serviço PostgreSQL**
1. No Easypanel → **"+ Serviço"**
2. Escolha **"PostgreSQL"**
3. Configure:
   - **Nome:** `sistema-adv-db`
   - **Database:** `adv`
   - **User:** `postgres`
   - **Password:** `@col3340MOC@` (ou outra senha segura)

### **1.2 Executar Schema SQL**
1. Acesse o PostgreSQL via terminal ou pgAdmin
2. Execute o arquivo `database/schema.sql` que está no projeto
3. Isso criará todas as tabelas e o usuário admin padrão

**Credenciais do admin:**
- Email: `admin@sistema.com`
- Senha: `admin123`

---

## 📋 PASSO 2: Criar Aplicação no Easypanel

### **2.1 Criar App**
1. No Easypanel → **"+ Aplicação"**
2. Escolha **"GitHub"**
3. Conecte ao repositório do projeto

### **2.2 Configurar Variáveis de Ambiente**

Na aba **"Environment"**, adicione:

```
POSTGRES_HOST=sistema-adv-db
POSTGRES_PORT=5432
POSTGRES_DB=adv
POSTGRES_USER=postgres
POSTGRES_PASSWORD=@col3340MOC@
JWT_SECRET=adv-sistema-jwt-secret-2024-change-in-production
NODE_ENV=production
```

⚠️ **IMPORTANTE:** Use o **nome do serviço PostgreSQL** como `POSTGRES_HOST`

### **2.3 Configurar Build**
- **Build Command:** `npm run build`
- **Start Command:** Deixe vazio (Dockerfile cuida disso)
- **Port:** `3000`

---

## 📋 PASSO 3: Deploy

1. Clique em **"Deploy"**
2. Aguarde o build (3-5 minutos)
3. Verifique os logs até aparecer: `✓ Ready in XXms`

---

## 🧪 PASSO 4: Testar

### **Teste 1 - Health Check:**
```
https://seu-dominio.easypanel.host/api/health
```

Deve retornar:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-03-18..."
}
```

### **Teste 2 - Página Principal:**
```
https://seu-dominio.easypanel.host
```

### **Teste 3 - Login:**
- Acesse `/login`
- Email: `admin@sistema.com`
- Senha: `admin123`

---

## 📊 Estrutura do Projeto

```
sistema-adv-v2/
├── app/
│   ├── api/
│   │   └── health/          # Endpoint de health check
│   ├── page.tsx             # Página inicial
│   └── layout.tsx           # Layout principal
├── lib/
│   ├── db.ts                # Conexão PostgreSQL
│   └── auth.ts              # Autenticação JWT
├── database/
│   └── schema.sql           # Schema do banco de dados
├── Dockerfile               # Docker otimizado
├── next.config.js           # Configuração Next.js standalone
└── package.json             # Dependências
```

---

## 🔧 Diferenças do Projeto Anterior

| Aspecto | Projeto Antigo | Projeto Novo |
|---------|---------------|--------------|
| Criação | Migrado do Supabase | Criado do zero |
| Dependências | Conflitos Supabase | Apenas PostgreSQL nativo |
| Dockerfile | Problemas de permissão | Otimizado e testado |
| Build | Erros constantes | ✅ Sucesso |
| Código | Resquícios antigos | Limpo e organizado |

---

## ✅ Vantagens do Projeto Novo

1. **Sem conflitos** - Nenhum resquício de Supabase
2. **Dockerfile correto** - Seguindo documentação oficial
3. **Build testado** - Funciona localmente
4. **Código limpo** - Estrutura organizada
5. **PostgreSQL nativo** - Desde o início

---

## 🎯 Próximos Passos Após Deploy Funcionar

1. Implementar páginas do dashboard
2. Adicionar CRUD de clientes
3. Adicionar CRUD de processos
4. Implementar agenda
5. Adicionar gestão de documentos

---

**Este projeto foi criado do ZERO para evitar todos os problemas do anterior!** 🚀
