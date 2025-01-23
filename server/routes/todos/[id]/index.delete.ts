export default eventHandler(async (event) => {

  const id = getRouterParam(event, 'id')

  const query = `
      DELETE
      FROM todos
      WHERE id = ${id}
  `;


  try {
    const client = await pool.connect()
    const result = await client.query(query);

    client.release();

    return new Response('Deleted', {
      status: 200
    });

  } catch (error: any) {
    console.error('Error inserting new todo:', error);
    return new Response(`Error inserting new todo: ${error.message}`, {
      status: 500
    });
  }

})