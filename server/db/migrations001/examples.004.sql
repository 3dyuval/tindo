
/*
4. An Actor Can Query All of Their Collaborators Based on a Tag
Objective: Retrieve all collaborators associated with todos linked to a specific tag for that actor.

SQL Query:
*/

SELECT
    DISTINCT ac.id AS collaborator_id,
    ac.name AS collaborator_name,
    ac.email AS collaborator_email
FROM
    todos t
INNER JOIN
    todo_tags tt ON t.id = tt.todo_id
INNER JOIN
    tags tg ON tt.tag_id = tg.id
INNER JOIN
    todo_collaborators tc ON t.id = tc.todo_id
INNER JOIN
    actors ac ON tc.actor_id = ac.id
WHERE
    tg.name = :tag_name
    AND (t.user_id = :actor_id
        OR t.id IN (
            SELECT todo_id FROM todo_collaborators WHERE actor_id = :actor_id
        ))
    AND ac.id != :actor_id;

 /*
Explanation:

Replace :tag_name with the name of the tag.

Replace :actor_id with the ID of the actor.

The query selects collaborators (ac) associated with todos tagged with the specified tag (tg.name = :tag_name) and belonging to the actor (either as creator or collaborator).

Excludes the actor themselves (ac.id != :actor_id).

DISTINCT ensures each collaborator appears only once.

 ---

 */