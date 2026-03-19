# 🏛️ Sistema de Gestão para Advocacia V2

Sistema moderno de gestão para escritórios de advocacia, criado do zero com Next.js 14 e PostgreSQL.

## ✅ Projeto Criado do Zero

Este é um projeto **completamente novo**, sem os problemas do projeto anterior:
- ✅ Next.js 14.2.4 instalado limpo
- ✅ PostgreSQL nativo (sem Supabase)
- ✅ Autenticação JWT + bcrypt
- ✅ Dockerfile otimizado
- ✅ Build testado com sucesso

## 🚀 Tecnologias

- **Framework:** Next.js 14.2.4 (App Router)
- **Linguagem:** TypeScript
- **Banco de Dados:** PostgreSQL (nativo com `pg`)
- **Autenticação:** JWT + bcrypt
- **Estilização:** Tailwind CSS
- **Ícones:** Lucide React
- **Deploy:** Docker + Easypanel

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

## 🔧 Instalação Local

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd sistema-adv-v2
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais PostgreSQL.

4. Execute o schema do banco de dados:
```bash
psql -U postgres -d adv -f database/schema.sql
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 🐳 Deploy no Easypanel

Veja o arquivo `DEPLOY-EASYPANEL.md` para instruções completas de deploy.

### Resumo:
1. Criar serviço PostgreSQL no Easypanel
2. Executar `database/schema.sql`
3. Criar app conectado ao GitHub
4. Configurar variáveis de ambiente
5. Deploy!

## 🔐 Credenciais Padrão

Após executar o schema SQL:
- **Email:** admin@sistema.com
- **Senha:** admin123

⚠️ **Altere essas credenciais em produção!**

## 📁 Estrutura do Projeto

```
sistema-adv-v2/
├── app/                    # App Router do Next.js
│   ├── api/               # API Routes
│   │   └── health/        # Health check endpoint
│   ├── page.tsx           # Página inicial
│   └── layout.tsx         # Layout principal
├── lib/                   # Bibliotecas e utilitários
│   ├── db.ts             # Conexão PostgreSQL
│   └── auth.ts           # Autenticação JWT
├── database/             # Scripts SQL
│   └── schema.sql        # Schema do banco
├── components/           # Componentes React
├── Dockerfile            # Docker para produção
├── next.config.js        # Configuração Next.js
└── package.json          # Dependências
```

## 🧪 Endpoints da API

### Health Check
```
GET /api/health
```

Retorna status da conexão com o banco de dados.

## 🛠️ Scripts Disponíveis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm run start    # Inicia servidor de produção
npm run lint     # Executa linter
```

## 📊 Schema do Banco de Dados

- **users** - Usuários do sistema
- **clients** - Clientes do escritório
- **processes** - Processos jurídicos
- **documents** - Documentos dos processos
- **appointments** - Agenda de compromissos

## 🔒 Segurança

- Senhas hasheadas com bcrypt (10 rounds)
- Autenticação via JWT (7 dias de validade)
- Variáveis de ambiente para credenciais
- Prepared statements para prevenir SQL injection

## 📝 Licença

Projeto privado para uso interno.

---

**Criado do zero para evitar problemas do projeto anterior!** 🚀
