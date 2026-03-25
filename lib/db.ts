import { Pool } from 'pg';

let pool: Pool | null = null;

function getPool() {
  if (!pool) {
    const sslConfig = process.env.POSTGRES_SSL === 'true' 
      ? { rejectUnauthorized: false }
      : false;
    
    pool = new Pool({
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      database: process.env.POSTGRES_DB || 'adv',
      user: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
      ssl: sslConfig,
    });
  }
  return pool;
}

export async function query(text: string, params?: any[]) {
  const currentPool = getPool();
  const result = await currentPool.query(text, params);
  return result;
}

export async function getClient() {
  const currentPool = getPool();
  return await currentPool.connect();
}
