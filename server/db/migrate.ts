import { neon, Pool } from '@neondatabase/serverless';
import { hfs } from "@humanfs/node";
import * as path from 'path';


const sql = neon(process.env.DB_URL);
const migrationsDir = path.join(__dirname, 'db', 'migrations');
let migrationFiles: Promise<any>[] = []

for (const item of await hfs.list(migrationsDir)) {
  if (await (hfs.isFile(item)) && item.endsWith('.sql')) {
    migrationFiles.push(item);
  }
}

(async () => {
  try {
    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      console.log(`Running migration: ${file}`);
      const sqlCommands = await hfs.text(filePath);

      // Split the SQL file into individual commands
      const commands = sqlCommands
          .split(/;\s*$/m) // Split at semicolons at the end of lines
          .map(cmd => cmd.trim())
          .filter(cmd => cmd.length > 0);

      for (const command of commands) {
        // Execute each command
        await sql(command);
      }
    }
    console.log('All migrations have been run successfully.');
  } catch (err) {
    console.error('An error occurred while running migrations:', err);
  }
})();

const pool = new Pool({
  connectionString: process.env.DB_URL,
  database: 'todos'
});
