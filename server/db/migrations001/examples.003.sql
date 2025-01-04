
/*
3. An Actor Can Query All of Their Collaborators Based on a Single Todo
Objective: Retrieve all collaborators of a specific todo.

SQL Query:
*/

SELECT
    ac.id AS collaborator_id,
    ac.name AS collaborator_name,
    ac.email AS collaborator_email
FROM
    todo_collaborators tc
INNER JOIN
    actors ac ON tc.actor_id = ac.id
WHERE
    tc.todo_id = :todo_id
    AND ac.id != :actor_id;

 /*
Explanation:

Replace :todo_id with the ID of the todo in question.

Replace :actor_id with the ID of the actor performing the query.

The query selects all collaborators (ac) associated with the specified todo.

Excludes the querying actor themselves (ac.id != :actor_id).



 ---

 */