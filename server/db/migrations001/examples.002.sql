
/*
2. Actor Can Query All of Their Tags Based on Their Todos
Objective: Fetch all tags associated with the actor's todos.

SQL Query:
*/

SELECT
    DISTINCT tg.id AS tag_id,
    tg.name AS tag_name
FROM
    todos t
LEFT JOIN
    todo_tags tt ON t.id = tt.todo_id
LEFT JOIN
    tags tg ON tt.tag_id = tg.id
WHERE
    t.user_id = :actor_id
    OR t.id IN (
        SELECT todo_id FROM todo_collaborators WHERE actor_id = :actor_id
    );

 /*
Explanation:

Replace :actor_id with the ID of the actor.

Retrieves all tags (tg) linked to todos (t) where the actor is the creator or a collaborator.

DISTINCT ensures that each tag appears only once.



 ---

 */