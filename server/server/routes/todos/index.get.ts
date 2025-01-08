import { assertMethod, handleCors, isMethod } from "h3"
import { getUser } from "~~/utils/getUser"
import { Pool } from '@neondatabase/serverless';


const pool = new Pool({
  connectionString: process.env.DB_URL,
  database: 'todos'
});


export default eventHandler(async (event) => {

  handleCors(event, {
    origin: process.env.ALLOW_ORIGIN.split(',')
  })

  const user = await getUser(event)
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