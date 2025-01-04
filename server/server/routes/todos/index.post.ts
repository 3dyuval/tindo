import { assertMethod, handleCors, isMethod } from "h3"
import { getUser } from "~~/utils/getUser"
import { z } from "zod"
import pg from 'pg'


const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: 'electric'
});


export default eventHandler(async (event) => {
  handleCors(event, {
    origin: process.env.ALLOW_ORIGIN.split(',').filter(Boolean)
  })
  const user = await getUser(event)
  if (!user) {
    return new Response(`user not found`, { status: 401 })
  }

  const body = await readBody(event);

  const inputSchema = z.object({
    data: z.record(z.any()).optional()
  });


  const parseResult = inputSchema.safeParse(body);
  if (!parseResult.success) {
    return new Response(`Invalid input data: ${parseResult.error.message}`, {
      status: 400
    });
  }

  const { data } = parseResult.data;

  const query = `
    INSERT INTO todos (creator_id, data)
    VALUES ($1, $2)
    RETURNING id, creator_id, data, created_at, updated_at;
  `;


  try {
    const client = await pool.connect()

    const result = await client.query(query, [user.id, data]);
    const newTodo = result.rows[0];

    client.release();

    return new Response(JSON.stringify(newTodo), {
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