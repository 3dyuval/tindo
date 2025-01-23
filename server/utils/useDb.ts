import { neon, Pool } from '@neondatabase/serverless';

if (!process.env.NITRO_DB_URL) {
  throw new Error('DB_URL environment variable is not set');
}

const pool = new Pool({
  connectionString: process.env.NITRO_DB_URL
});


const sql = neon(process.env.NITRO_DB_URL);

export { pool, sql }
