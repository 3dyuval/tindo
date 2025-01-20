import { H3Event, handleCors } from "h3"
import { sql, useUser } from "~~/utils"


export default eventHandler(async (event: H3Event) => {

  const user = await useUser(event)
  if (!user) {
    return new Response(`user not found`, { status: 401 })
  }

  const payload = await readBody(event)


  if (!payload.body) {
    return new Response(`Invalid input data: ${payload}`, {
      status: 400
    });
  }

  const query = `
      INSERT INTO todos (creator_id, data)
      VALUES ($1, $2) RETURNING id, creator_id, data, created_at, updated_at;
  `;


  try {

    const result = await sql(query, [user.id, payload.body]);

    return new Response(JSON.stringify(result), {
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