import { sql } from "~~/utils/useDb"
import { itemDataSchema } from "../../../@types.zod"


export default eventHandler(async (event) => {

  const payload = await readBody(event)

  const itemData = itemDataSchema.safeParse(payload.data)

  if (!itemData.success) {
    return new Response(`Invalid input data: ${payload}`, {
      status: 400
    });
  }

  const query = `
      INSERT INTO todos (creator_id, data)
      VALUES ($1, $2)
      RETURNING created_at, id;
  `;


  try {

    const result = await sql(query, [event.context.user.sub, payload.data]);

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