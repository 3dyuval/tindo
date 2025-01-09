import { sql } from "../utils/useDb";


(async () => {
  console.log('Testing connection...');
  try {
    // const client = await pool('defaultdb').connect().then(console.log)
    // const result = await client.query(`SELECT 1;`).then(console.log)
    const { result } = await sql(`SELECT 1;`);
    console.log(result.rows);
  } catch (err) {
    console.error('An error occurred while running test:', err);
  }
})()