# 🗄️ COMO EXECUTAR O SCRIPT SQL

## 📋 OPÇÃO 1: Usando pgAdmin (RECOMENDADO)

### Passo 1: Abrir pgAdmin
1. Abra o **pgAdmin 4**
2. Conecte ao servidor PostgreSQL local
3. Digite a senha do postgres quando solicitado

### Passo 2: Abrir Query Tool
1. Clique com botão direito em **PostgreSQL 16** (ou sua versão)
2. Selecione **Query Tool**

### Passo 3: Carregar o Script
1. Na Query Tool, clique no ícone **Open File** (pasta)
2. Navegue até a pasta do projeto
3. Selecione o arquivo `criar-banco-completo.sql`
4. Clique em **Abrir**

### Passo 4: Executar
1. Clique no botão **Execute** (▶️) ou pressione **F5**
2. Aguarde a execução (leva cerca de 5-10 segundos)
3. Verifique a aba **Messages** para ver os resultados

### Passo 5: Verificar
Você deve ver mensagens como:
```
✅ Tabelas criadas com sucesso!
✅ Usuário admin criado!
🎉 BANCO DE DADOS CRIADO COM SUCESSO!
```

---

## 📋 OPÇÃO 2: Usando SQL Shell (psql)

### Passo 1: Abrir SQL Shell
1. Procure por **SQL Shell (psql)** no menu iniciar
2. Abra o programa

### Passo 2: Conectar
Pressione Enter para aceitar os valores padrão:
```
Server [localhost]: (Enter)
Database [postgres]: (Enter)
Port [5432]: (Enter)
Username [postgres]: (Enter)
Password: (digite sua senha)
```

### Passo 3: Executar o Script
Digite o comando (ajuste o caminho se necessário):
```sql
\i 'E:/Lilian Bukolts/Escritório Advocacia_files/sistema-adv-v2/criar-banco-completo.sql'
```

Pressione **Enter**

### Passo 4: Verificar
Você verá todas as mensagens de criação das tabelas e dados.

---

## 📋 OPÇÃO 3: Linha de Comando (PowerShell/CMD)

### Se o psql estiver no PATH:
```bash
cd "E:\Lilian Bukolts\Escritório Advocacia_files\sistema-adv-v2"
psql -U postgres -f criar-banco-completo.sql
```

Digite a senha quando solicitado.

---

## ✅ VERIFICAR SE DEU CERTO

### Método 1: No pgAdmin
1. No pgAdmin, expanda **Databases**
2. Você deve ver o banco **adv**
3. Expanda **adv** → **Schemas** → **public** → **Tables**
4. Deve ter 6 tabelas:
   - users
   - clients
   - processes
   - documents
   - appointments
   - notes

### Método 2: Via SQL
Execute no Query Tool ou psql:
```sql
\c adv
\dt
```

Deve listar todas as 6 tabelas.

### Método 3: Verificar usuário admin
```sql
\c adv
SELECT email, full_name, role FROM users;
```

Deve mostrar:
```
email                | full_name                  | role
---------------------|----------------------------|-------
admin@sistema.com    | Administrador do Sistema   | admin
```

---

## 🧪 TESTAR CONEXÃO DO SISTEMA

### Passo 1: Verificar .env.local
Certifique-se que o arquivo `.env.local` existe com:
```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=adv
POSTGRES_USER=postgres
POSTGRES_PASSWORD=sua_senha_aqui
JWT_SECRET=adv-sistema-jwt-secret-2024-change-in-production
NODE_ENV=development
```

### Passo 2: Testar conexão
```bash
node test-db-connection.js
```

Deve mostrar:
```
🎉 TODOS OS TESTES PASSARAM!
```

### Passo 3: Rodar o sistema
```bash
npm run dev
```

### Passo 4: Acessar
Abra o navegador em:
```
http://localhost:3000/api/health
```

Deve retornar:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-03-25..."
}
```

---

## ❓ PROBLEMAS COMUNS

### Erro: "permission denied to create database"
**Solução:** Você precisa estar conectado como usuário `postgres` ou outro superusuário.

### Erro: "database adv is being accessed by other users"
**Solução:** O script já desconecta automaticamente. Se persistir:
1. Feche todas as conexões ao banco `adv`
2. Feche o pgAdmin
3. Execute o script novamente

### Erro: "could not connect to server"
**Solução:** 
1. Verifique se o PostgreSQL está rodando
2. No Windows, vá em Serviços e procure por `postgresql-x64-16`
3. Se estiver parado, clique em **Iniciar**

### Erro: "syntax error near \c"
**Solução:** O comando `\c` só funciona no psql. No pgAdmin:
1. Execute o script até a linha do `DROP DATABASE`
2. Depois conecte manualmente ao banco `adv`
3. Execute o resto do script

---

## 🌐 PARA EASYPANEL

Depois que funcionar localmente, para o Easypanel:

### 1. Criar PostgreSQL no Easypanel
- Nome: `sistema-adv-db`
- Database: `adv`
- User: `postgres`
- Password: (escolha uma senha forte)

### 2. Executar SQL no Easypanel
Use o terminal do PostgreSQL no Easypanel para executar o mesmo script `criar-banco-completo.sql`

### 3. Configurar Variáveis de Ambiente
```env
POSTGRES_HOST=sistema-adv-db
POSTGRES_PORT=5432
POSTGRES_DB=adv
POSTGRES_USER=postgres
POSTGRES_PASSWORD=sua_senha_easypanel
JWT_SECRET=adv-sistema-jwt-secret-2024-change-in-production
NODE_ENV=production
```

---

## 📊 O QUE O SCRIPT FAZ

1. ✅ Desconecta usuários do banco antigo (se existir)
2. ✅ Apaga banco antigo (se existir)
3. ✅ Cria banco novo `adv`
4. ✅ Cria extensão UUID
5. ✅ Cria 6 tabelas (users, clients, processes, documents, appointments, notes)
6. ✅ Cria índices para performance
7. ✅ Cria triggers para atualizar `updated_at` automaticamente
8. ✅ Insere usuário admin
9. ✅ Insere cliente de exemplo
10. ✅ Mostra estatísticas finais

---

**Siga estes passos e seu banco estará 100% configurado!** 🚀
