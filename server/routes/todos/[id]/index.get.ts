import { sql } from "~/utils/useDb"


export default eventHandler(async (event) => {

      const id = await useParamId(event)

      const query = `
          SELECT *
          FROM todos
          WHERE id = '${id}';
      `;

      const result = await sql(query)
          .catch((error: any) => {
            console.error('Error querying todo:', error);
            return new Response(`Error querying todo: ${error.message}`, {
              status: 500
            });
          })


      if (!result.length) {
        return new Response(`Todo not found: ${id}`, {
          status: 404
        });
      }

      return new Response(JSON.stringify(result), {
        status: 200,
      });

    }
)