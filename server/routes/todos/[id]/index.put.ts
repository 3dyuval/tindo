import { sql } from "~/utils/useDb"
import { itemBodySchema } from "../../../../@types.zod"


export default eventHandler(async (event) => {


  const payload = await readBody(event)
  const itemBody = itemBodySchema.safeParse(payload.body)

  if (!itemBody.success) {
    return new Response(`Invalid input data: ${JSON.stringify(itemBody.error)}`, {
      status: 400
    });
  }

  const id = getRouterParam(event, 'id')

  let checkQuery = `
      SELECT COUNT(*) as count
      FROM todos
      WHERE id = '${id}'`;

  if (!event.context.user.roles.includes('admin')) {
    checkQuery += ` AND creator_id='${event.context.user.id}'`; // Filter by creator_id if not an admin
  }

  const [{ count }] = await sql(checkQuery)

  if (!+count) {
    return new Response(`Todo not found: ${id}`, {
      status: 404
    });
  }

  let query = `
      INSERT INTO todos (creator_id, data)
      VALUES ('${event.context.user.id}', itemBody)
      RETURNING *;
  `;

  if (!event.context.user.roles.includes('admin')) {
    query += ` AND creator_id='${event.context.user.id}'`; // Filter by creator_id if not an admin
  }

  const result = await sql(query)
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