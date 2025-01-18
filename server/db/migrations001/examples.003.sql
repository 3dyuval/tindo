
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
    users ac ON tc.user_id = ac.id
WHERE
    tc.todo_id = :todo_id
    AND ac.id != :user_id;

 /*
Explanation:

Replace :todo_id with the ID of the todo in question.

Replace :user_id with the ID of the user performing the query.

The query selects all collaborators (ac) associated with the specified todo.

Excludes the querying user themselves (ac.id != :user_id).



 ---

 */