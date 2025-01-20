import { neon, Pool } from '@neondatabase/serverless';

//@ts-ignore
const dbUrl = process.env.NITRO_DB_URL_REMOTE
if (!dbUrl) {
  throw new Error('DB_URL environment variable is not set');
}

const pool = new Pool({
  connectionString: dbUrl,
  database: 'todos'
});


const sql = neon(dbUrl);

export { pool, sql }
