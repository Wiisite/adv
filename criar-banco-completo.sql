-- ============================================
-- SCRIPT COMPLETO - CRIAR BANCO DO ZERO
-- Sistema de Gestão de Advocacia
-- ============================================
-- 
-- INSTRUÇÕES:
-- 1. Abra pgAdmin ou SQL Shell (psql)
-- 2. Conecte como usuário postgres
-- 3. Execute TODO este arquivo
-- 4. O script vai:
--    - Desconectar usuários do banco (se existir)
--    - Dropar banco antigo (se existir)
--    - Criar banco novo
--    - Criar todas as tabelas
--    - Criar índices
--    - Inserir usuário admin
-- ============================================

-- Desconectar todos os usuários do banco (se existir)
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = 'adv'
  AND pid <> pg_backend_pid();

-- Dropar banco se existir (CUIDADO: apaga tudo!)
DROP DATABASE IF EXISTS adv;

-- Criar banco novo
CREATE DATABASE adv
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Portuguese_Brazil.1252'
    LC_CTYPE = 'Portuguese_Brazil.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Conectar ao banco adv
\c adv

-- ============================================
-- CRIAR EXTENSÕES
-- ============================================

-- Extensão para gerar UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CRIAR TABELAS
-- ============================================

-- Tabela de usuários
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'lawyer' CHECK (role IN ('admin', 'lawyer', 'assistant')),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de clientes
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    cpf VARCHAR(14) UNIQUE,
    address TEXT,
    notes TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de processos
CREATE TABLE processes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    process_number VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'pending', 'closed', 'archived')),
    description TEXT,
    court VARCHAR(255),
    judge VARCHAR(255),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de documentos
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    process_id UUID NOT NULL REFERENCES processes(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    file_path VARCHAR(500),
    file_type VARCHAR(50),
    file_size INTEGER,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de compromissos/agenda
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    process_id UUID REFERENCES processes(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    appointment_date TIMESTAMP NOT NULL,
    duration INTEGER DEFAULT 60, -- em minutos
    location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
    reminder_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de anotações/observações
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    process_id UUID REFERENCES processes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(255),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- CRIAR ÍNDICES PARA PERFORMANCE
-- ============================================

-- Índices para users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(active);

-- Índices para clients
CREATE INDEX idx_clients_full_name ON clients(full_name);
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_cpf ON clients(cpf);
CREATE INDEX idx_clients_active ON clients(active);

-- Índices para processes
CREATE INDEX idx_processes_client_id ON processes(client_id);
CREATE INDEX idx_processes_process_number ON processes(process_number);
CREATE INDEX idx_processes_status ON processes(status);
CREATE INDEX idx_processes_category ON processes(category);
CREATE INDEX idx_processes_created_at ON processes(created_at DESC);

-- Índices para documents
CREATE INDEX idx_documents_process_id ON documents(process_id);
CREATE INDEX idx_documents_file_type ON documents(file_type);
CREATE INDEX idx_documents_created_at ON documents(created_at DESC);

-- Índices para appointments
CREATE INDEX idx_appointments_client_id ON appointments(client_id);
CREATE INDEX idx_appointments_process_id ON appointments(process_id);
CREATE INDEX idx_appointments_appointment_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);

-- Índices para notes
CREATE INDEX idx_notes_process_id ON notes(process_id);
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_created_at ON notes(created_at DESC);

-- ============================================
-- CRIAR TRIGGERS PARA UPDATED_AT
-- ============================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para cada tabela
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_processes_updated_at BEFORE UPDATE ON processes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INSERIR DADOS INICIAIS
-- ============================================

-- Usuário admin padrão
-- Email: admin@sistema.com
-- Senha: admin123
INSERT INTO users (email, password_hash, full_name, role, active) 
VALUES (
    'admin@sistema.com',
    '$2b$10$xxWVuPbdIStaisph21BjducI6sdvMatLdSmo8Skj24uhPn4zLPc16',
    'Administrador do Sistema',
    'admin',
    true
);

-- Cliente de exemplo (opcional - pode comentar se não quiser)
INSERT INTO clients (full_name, email, phone, cpf, address, notes)
VALUES (
    'Cliente Exemplo',
    'cliente@exemplo.com',
    '(11) 98765-4321',
    '123.456.789-00',
    'Rua Exemplo, 123 - São Paulo/SP',
    'Cliente de exemplo para testes do sistema'
);

-- ============================================
-- VERIFICAÇÕES FINAIS
-- ============================================

-- Listar todas as tabelas criadas
SELECT 
    '✅ Tabelas criadas com sucesso!' as status,
    COUNT(*) as total_tabelas
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Mostrar todas as tabelas
SELECT 
    table_name as tabela,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as colunas
FROM information_schema.tables t
WHERE table_schema = 'public'
ORDER BY table_name;

-- Verificar usuário admin
SELECT 
    '✅ Usuário admin criado!' as status,
    email,
    full_name,
    role
FROM users 
WHERE email = 'admin@sistema.com';

-- Mostrar estatísticas
SELECT 
    '📊 Estatísticas do Banco' as info,
    (SELECT COUNT(*) FROM users) as usuarios,
    (SELECT COUNT(*) FROM clients) as clientes,
    (SELECT COUNT(*) FROM processes) as processos,
    (SELECT COUNT(*) FROM documents) as documentos,
    (SELECT COUNT(*) FROM appointments) as compromissos;

-- ============================================
-- FIM DO SCRIPT
-- ============================================

-- Mensagem final
SELECT '🎉 BANCO DE DADOS CRIADO COM SUCESSO!' as mensagem;
SELECT '📝 Credenciais de acesso:' as info;
SELECT '   Email: admin@sistema.com' as credencial_1;
SELECT '   Senha: admin123' as credencial_2;
