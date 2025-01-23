import { H3Event } from "h3"
import { sql } from "~~/utils/useDb"
import { useUser } from "~~/utils/useUser"


export default eventHandler(async (event) => {


  const payload = await readBody(event)


  if (!payload.body) {
    return new Response(`Invalid input data: ${payload}`, {
      status: 400
    });
  }

  const query = `
      INSERT INTO todos (creator_id, data)
      VALUES (${event.contenxt.user.id}, ${payload.body}) RETURNING id, creator_id, data, created_at, updated_at;
  `;


  try {

    const result = await sql(query);

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