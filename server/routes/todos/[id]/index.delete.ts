export default eventHandler(async (event) => {

  const id = getRouterParam(event, 'id')


  let query = `
      DELETE
      FROM todos
      WHERE id = '${id}'
  `;

  if (!event.context.user.roles?.includes(`admin`)) {
    query += ` AND creator_id = '${event.context.user.sub}'`;
  }


  try {
    await sql(query);
    return new Response(null, {
      status: 204
    });

  } catch (error: any) {
    console.error('Error deleteing todo:', error);
    return new Response(`Error deleteing todo: ${error.message}`, {
      status: 500
    });
  }

})
