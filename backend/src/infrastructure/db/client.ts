import 'dotenv/config';
import { Pool } from 'pg';

// Singleton pool — shared across the entire app
const pool = new Pool({
  host:     process.env.DB_HOST     ?? 'localhost',
  port:     parseInt(process.env.DB_PORT ?? '5432', 10),
  database: process.env.DB_NAME     ?? 'fuel_eu_db',
  user:     process.env.DB_USER     ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  // Keep a small pool for dev; tune in prod
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 2_000,
});

pool.on('error', (err) => {
  console.error('[DB] Unexpected pool error:', err.message);
});

// Lightweight connectivity check used at startup
export async function checkDbConnection(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('SELECT 1');
    console.log('[DB] Connection established successfully');
  } finally {
    client.release();
  }
}

export default pool;