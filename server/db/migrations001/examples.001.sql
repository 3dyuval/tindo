
/*

1. Actor Can Query All of Their Collaborators Based on Their Todos
Objective: Retrieve all collaborators associated with an actor's todos.

SQL Query:

*/

SELECT
    DISTINCT ac.id AS collaborator_id,
    ac.name AS collaborator_name,
    ac.email AS collaborator_email
FROM
    todos t
INNER JOIN
    todo_collaborators tc ON t.id = tc.todo_id
INNER JOIN
    actors ac ON tc.actor_id = ac.id
WHERE
    t.creator_id = :actor_id
    OR t.id IN (
        SELECT todo_id FROM todo_collaborators WHERE actor_id = :actor_id
    )
    AND ac.id != :actor_id;


 /*

 Explanation:

 Replace :actor_id with the ID of the actor performing the query.

 The query selects all collaborators (ac) involved in todos where the actor is either the creator or a collaborator.

 Excludes the actor themselves from the list (ac.id != :actor_id).

 DISTINCT is used to avoid duplicates.

 ---

 */