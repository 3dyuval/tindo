import { assertMethod, handleCors, isMethod } from "h3"
import { useUser, pool } from "../../utils"



export default eventHandler(async (event) => {
  const user = await useUser(event)
  if (!user) {
    return new Response(`user not found`, { status: 401 })
  }

  const query = `
    SELECT * FROM todos
    WHERE creator_id = $1;
  `;

  try {
    const client = await pool.connect()
    const result = await client.query(query, [user.id]);
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