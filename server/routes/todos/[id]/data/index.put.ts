import { sql } from "~/utils/useDb"
import { itemDataSchema } from "../../../../../@types.zod"


export default eventHandler(async (event) => {


  const payload = await readBody(event)
  const itemData = itemDataSchema.safeParse(payload.body)

  if (!itemData.success) {
    return new Response(`Invalid input data: ${JSON.stringify(itemData.error)}`,
        { status: 400 }
    );
  }

  const todoId = getRouterParam(event, 'id')

  let checkQuery = `
      SELECT COUNT(*) as count
      FROM todos
      WHERE id = $1
      `

  if (!event.context.isAdmin) {
    checkQuery += ` AND creator_id = '${event.context.user.sub}'`;
  }

  const [{ count }] = await sql(checkQuery, [todoId, event.context.user.sub])

  if (!+count) {
    return new Response(`Todo not found: ${todoId}`,
        { status: 404 }
    );
  }

  let query = `
      INSERT INTO todos (creator_id, data)
      VALUES ($1, $2)
      RETURNING *;
  `;

  if (!event.context.isAdmin) {
    query += ` AND user_id='${event.context.user.id}'`; // Filter by user_id if not an admin
  }

  const result = await sql(query, [event.context.user.sub, itemData.data])
      .catch((error: any) => {
        console.error('Error updating todo:', error);
        return new Response(`Error updating todo: ${error.message}`, {
          status: 500
        });
      })

  return new Response(JSON.stringify(result), {
    status: 201,
    headers: { 'Content-Type': 'application/json' }
  })

})