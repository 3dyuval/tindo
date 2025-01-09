import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';
config({ path: '.env' });

export default defineConfig({
  schema: './db/drizzle/schema.ts',
  out: './db/.migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DB_DRIZZLE_URL!,
  },
});