
/*
4. An Actor Can Query All of Their Collaborators Based on a Tag
Objective: Retrieve all collaborators associated with todos linked to a specific tag for that user.

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
    users ac ON tc.user_id = ac.id
WHERE
    tg.name = :tag_name
    AND (t.creator_id = :user_id
        OR t.id IN (
            SELECT todo_id FROM todo_collaborators WHERE user_id = :user_id
        ))
    AND ac.id != :user_id;

 /*
Explanation:

Replace :tag_name with the name of the tag.

Replace :user_id with the ID of the user.

The query selects collaborators (ac) associated with todos tagged with the specified tag (tg.name = :tag_name) and belonging to the user (either as creator or collaborator).

Excludes the user themselves (ac.id != :user_id).

DISTINCT ensures each collaborator appears only once.

 ---

 */