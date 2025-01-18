
/*

1. Actor Can Query All of Their Collaborators Based on Their Todos
Objective: Retrieve all collaborators associated with an user's todos.

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
    users ac ON tc.user_id = ac.id
WHERE
    t.creator_id = :user_id
    OR t.id IN (
        SELECT todo_id FROM todo_collaborators WHERE user_id = :user_id
    )
    AND ac.id != :user_id;


 /*

 Explanation:

 Replace :user_id with the ID of the user performing the query.

 The query selects all collaborators (ac) involved in todos where the user is either the creator or a collaborator.

 Excludes the user themselves from the list (ac.id != :user_id).

 DISTINCT is used to avoid duplicates.

 ---

 */