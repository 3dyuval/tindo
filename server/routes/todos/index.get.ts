import { sql } from "~~/utils/useDb"


export default eventHandler(async (event) => {

      let query = `
          SELECT *
          FROM todos
      `;

      if (!event.context.user.roles?.includes('admin')) {
        query += ` WHERE creator_id = $1`;
      }


      return sql(query, [event.context.user.sub])
          .catch((error: any) => {
            console.error('Error querying todo:', error);
            return new Response(`Error querying todo: ${error.message}`, {
              status: 500
            });
          })

    }
)