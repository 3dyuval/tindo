import { neon, Pool } from '@neondatabase/serverless';
import dotenv from "dotenv";
dotenv.config({path: '../.env'});
import { env } from "std-env";


if (!env.DB_URL) {
  throw new Error('DB_URL environment variable is not set');
}

const pool = (database: string) => new Pool({
  connectionString: env.DB_URL,
});

const sql = neon(env.DB_URL);
export { pool, sql }
