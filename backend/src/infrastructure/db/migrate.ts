import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import pool, { checkDbConnection } from './client';

const MIGRATIONS_DIR = path.resolve(__dirname, '../../migrations');

async function runMigrations(): Promise<void> {
  await checkDbConnection();

  // Ensure a tracking table exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id         SERIAL PRIMARY KEY,
      filename   VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    )
  `);

  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort(); // alphabetical = 001_, 002_, ...

  for (const file of files) {
    const { rows } = await pool.query(
      'SELECT id FROM _migrations WHERE filename = $1',
      [file]
    );

    if (rows.length > 0) {
      console.log(`[Migrate] Skipping (already applied): ${file}`);
      continue;
    }

    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query(
        'INSERT INTO _migrations (filename) VALUES ($1)',
        [file]
      );
      await client.query('COMMIT');
      console.log(`[Migrate] ✅ Applied: ${file}`);
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(`[Migrate] ❌ Failed on: ${file}`, err);
      process.exit(1);
    } finally {
      client.release();
    }
  }

  console.log('[Migrate] All migrations complete.');
  await pool.end();
}

runMigrations().catch((err) => {
  console.error('[Migrate] Fatal error:', err);
  process.exit(1);
});