import { sql } from "~/utils/useDb"
import { itemDataSchema } from "../../../../../@types.zod"


export default eventHandler(async (event) => {


  const body = await readBody(event)
  const itemData = itemDataSchema.safeParse(body)

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
        AND creator_id = $2
  `

  const [{ count }] = await sql(checkQuery, [todoId, event.context.user.sub])

  if (!+count) {
    return new Response(`Todo not found: ${todoId}`,
        { status: 404 }
    );
  }

  const updateQuery = `
      UPDATE todos
      SET data       = $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
        AND creator_id = $3
      RETURNING *
  `


  try {
    const result = await sql(updateQuery, [
      itemData.data,
      todoId,
      event.context.user.sub
    ])

    if (!result.length) {
      return new Response(
          'Todo not updated',
          { status: 400 }
      )
    }

    return new Response(
        JSON.stringify(result[0]),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
    )
  } catch (error: any) {
    console.error('Error updating todo:', error)
    return new Response(
        `Error updating todo: ${error.message}`,
        { status: 500 }
    )
  }


})