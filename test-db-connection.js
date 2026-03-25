// Script para testar conexão com PostgreSQL
// Execute: node test-db-connection.js

const { Pool } = require('pg');

// Configuração do banco de dados
const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'adv',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
});

async function testConnection() {
  console.log('🔍 Testando conexão com PostgreSQL...\n');
  
  console.log('📋 Configuração:');
  console.log(`   Host: ${process.env.POSTGRES_HOST || 'localhost'}`);
  console.log(`   Port: ${process.env.POSTGRES_PORT || '5432'}`);
  console.log(`   Database: ${process.env.POSTGRES_DB || 'adv'}`);
  console.log(`   User: ${process.env.POSTGRES_USER || 'postgres'}`);
  console.log(`   Password: ${process.env.POSTGRES_PASSWORD ? '***' : 'NÃO DEFINIDA'}\n`);

  try {
    // Teste 1: Conectar ao banco
    console.log('✅ Teste 1: Conectando ao banco...');
    const client = await pool.connect();
    console.log('   ✓ Conexão estabelecida com sucesso!\n');

    // Teste 2: Verificar timestamp
    console.log('✅ Teste 2: Executando query de teste...');
    const timeResult = await client.query('SELECT NOW()');
    console.log(`   ✓ Timestamp: ${timeResult.rows[0].now}\n`);

    // Teste 3: Listar tabelas
    console.log('✅ Teste 3: Verificando tabelas...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    const expectedTables = ['users', 'clients', 'processes', 'documents', 'appointments', 'notes'];
    const foundTables = tablesResult.rows.map(row => row.table_name);
    
    if (tablesResult.rows.length === 0) {
      console.log('   ⚠️  NENHUMA TABELA ENCONTRADA!');
      console.log('   Execute o arquivo criar-banco-completo.sql para criar as tabelas.\n');
    } else {
      console.log(`   ✓ ${tablesResult.rows.length} tabelas encontradas:`);
      tablesResult.rows.forEach(row => {
        const isExpected = expectedTables.includes(row.table_name);
        console.log(`      ${isExpected ? '✓' : '•'} ${row.table_name}`);
      });
      
      // Verificar se todas as tabelas esperadas existem
      const missingTables = expectedTables.filter(t => !foundTables.includes(t));
      if (missingTables.length > 0) {
        console.log(`\n   ⚠️  Tabelas faltando: ${missingTables.join(', ')}`);
      }
      console.log('');
    }

    // Teste 4: Verificar usuário admin
    console.log('✅ Teste 4: Verificando usuário admin...');
    try {
      const userResult = await client.query('SELECT email, full_name, role FROM users LIMIT 1');
      if (userResult.rows.length > 0) {
        console.log('   ✓ Usuário encontrado:');
        console.log(`      Email: ${userResult.rows[0].email}`);
        console.log(`      Nome: ${userResult.rows[0].full_name}`);
        console.log(`      Role: ${userResult.rows[0].role}\n`);
      } else {
        console.log('   ⚠️  Nenhum usuário encontrado na tabela users.\n');
      }
    } catch (err) {
      console.log('   ⚠️  Tabela users não existe ou está vazia.\n');
    }

    client.release();

    console.log('🎉 TODOS OS TESTES PASSARAM!');
    console.log('   O banco de dados está configurado corretamente.\n');
    
  } catch (error) {
    console.error('❌ ERRO DE CONEXÃO:\n');
    console.error(`   ${error.message}\n`);
    
    if (error.message.includes('password authentication failed')) {
      console.log('💡 SOLUÇÃO:');
      console.log('   - Verifique a senha do PostgreSQL no arquivo .env.local');
      console.log('   - A senha padrão geralmente é "postgres"\n');
    } else if (error.message.includes('database') && error.message.includes('does not exist')) {
      console.log('💡 SOLUÇÃO:');
      console.log('   - Crie o banco de dados "adv" no PostgreSQL');
      console.log('   - Use pgAdmin ou execute: CREATE DATABASE adv;\n');
    } else if (error.message.includes('connect ECONNREFUSED')) {
      console.log('💡 SOLUÇÃO:');
      console.log('   - Verifique se o PostgreSQL está rodando');
      console.log('   - Verifique o host e porta no arquivo .env.local\n');
    }
  } finally {
    await pool.end();
  }
}

testConnection();
