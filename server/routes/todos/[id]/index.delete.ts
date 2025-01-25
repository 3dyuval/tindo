// export default eventHandler({
//   onRequest: [useParamId],
//   handler: async (event) => {
//
//     const id = getRouterParam(event, 'id')
//
//     const query = `
//         DELETE
//         FROM todos
//         WHERE id = '${id}'
//     `;
//
//
//     try {
//       await sql(query);
//
//       return new Response(null, {
//         status: 204
//       });
//
//     } catch (error: any) {
//       console.error('Error deleteing todo:', error);
//       return new Response(`Error deleteing todo: ${error.message}`, {
//         status: 500
//       });
//     }
//
//   })
// })