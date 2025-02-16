import { sql } from "~/utils/useDb"
import { zh } from "h3-zod"
import { z } from "zod"


export default eventHandler(async (event) => {

      const { data, error } = await zh.useSafeValidatedParams(event, {
        id: z.string().uuid()
      })

      if (error) {
        return new Response(`Todo not found`, {
          status: 404,
          headers: {
            'Content-Type': 'text/plain'
          }
        })
      }

      let query = `
          SELECT *
          FROM todos
          WHERE id = $1
      `;

      if (!event.context.isAdmin) {
        query += ` AND creator_id = '${event.context.user.sub}'`; // Filter by user_id if not an admin
      }

      const result = await sql(query, [data.id])
          .catch((error: any) => {
            console.error('Error querying todo:', error);
            return new Response(`Error querying todo: ${error.message}`, {
              status: 500
            });
          })


      if (result instanceof Response) {
        return result
      }

      if (!result.length) {
        return new Response(`404: Todo not found ${data.id}`, {
          status: 404
        });
      }

      return new Response(
          JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });

    }
)