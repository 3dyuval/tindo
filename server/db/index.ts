import { hfs } from "@humanfs/node";
import { HfsWalkEntry } from "@humanfs/types";
import { sql } from "../utils/useDb";
import { config } from "dotenv";


config({ path: '../.env' });


(async () => {

  const migrationsDir = __dirname
  let migrationFiles: HfsWalkEntry[] = []

  for await (const entry of hfs.walk(migrationsDir)) {
    if (entry.name.endsWith('.sql') && entry.name.startsWith('migration')) {
      migrationFiles.push(entry);
    }
  }

  try {
    for (const file of migrationFiles) {
      console.log(`Running migration: ${file.name}`);
      const sqlCommands = await hfs.text(file.path);

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

