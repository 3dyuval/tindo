import { H3Event } from "h3"
import { sql } from "~~/utils/useDb"
import { useUser } from "~~/utils/useUser"
import { itemBodySchema } from "../../../@types.zod"


export default eventHandler(async (event) => {


  const payload = await readBody(event)

  const itemBody = itemBodySchema.safeParse(payload.body)

  if (!itemBody.success) {
    return new Response(`Invalid input data: ${payload}`, {
      status: 400
    });
  }

  const query = `
      INSERT INTO todos (user_id, data) VALUES ($1, $2) RETURNING created_at, id;
  `;


  try {

    const result = await sql(query, [event.context.user.id, payload.body ]);

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