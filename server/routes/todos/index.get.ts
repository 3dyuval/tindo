import { pool } from "~~/utils/useDb"
import { useUser } from "~~/utils/useUser"


export default eventHandler(async (event) => {

  const query = `
      SELECT *
      FROM todos
      WHERE creator_id = ${event.context.user.id};
  `;

  try {
    const client = await pool.connect()
    const result = await client.query(query);
    client.release();

    return new Response(JSON.stringify(result.rows), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Error inserting new todo:', error);
    return new Response(`Error inserting new todo: ${error.message}`, {
      status: 500
    });
  }

})