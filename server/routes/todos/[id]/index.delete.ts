import { assertMethod, handleCors, isMethod } from "h3"
import { useUser, pool } from "../../../utils"

export default eventHandler(async (event) => {
  handleCors(event, {
    origin: process.env.NITRO_ALLOW_ORIGIN
})

  const user = await useUser(event)
  if (!user) {
    return new Response(`user not found`, { status: 401 })
  }

  const id = getRouterParam(event, 'id')

  const query = `
    DELETE FROM todos WHERE id = $1
  `;


  try {
    const client = await pool.connect()
    const result = await client.query(query, [id]);

    client.release();

    return new Response('Deleted', {
      status: 200,
    });

  } catch (error: any) {
    console.error('Error inserting new todo:', error);
    return new Response(`Error inserting new todo: ${error.message}`, {
      status: 500
    });
  }

})