import { sql } from "../../utils/useDb"

export class TodosService {
  async find() {
    let query = `
        SELECT *
        FROM todos
    `;


    return sql(query)
        .catch((error: any) => {
          console.error('Error querying todo:', error);
          return new Response(`Error querying todo: ${error.message}`, {
            status: 500
          });
        })

  }
}