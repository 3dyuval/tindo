import { sql } from "~~/utils/useDb"


export default eventHandler(async (event) => {

      let query = `
          SELECT *
          FROM todos
      `;

      if (!event.context.user.roles.includes('admin')) {
        query += ` WHERE creator_id='${event.context.user.id}'`;
      }


      return sql(query)
          .catch((error: any) => {
            console.error('Error querying todo:', error);
            return new Response(`Error querying todo: ${error.message}`, {
              status: 500
            });
          })

    }
)