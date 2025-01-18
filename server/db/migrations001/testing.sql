
/*
Testing the Queries
Sample Data Insertion
Let's insert some sample data to test the queries.


SQL Query:
*/
-- Insert users
INSERT INTO users (name, email) VALUES
('Alice', 'alice@example.com'),
('Bob', 'bob@example.com'),
('Charlie', 'charlie@example.com');

-- Insert Tags
INSERT INTO tags (tag_id) VALUES
('Work'),
('Personal');

-- Actor1 creates a todo
INSERT INTO todos (creator_id, data) VALUES
('e866a326-a38a-4ffc-811e-684365467179', '{"title": "Project Proposal"}');

-- Actor1 adds collaborators to the todo
INSERT INTO todo_collaborators (todo_id, user_id) VALUES
('todo1-uuid', 'user2-uuid'),
('todo1-uuid', 'user3-uuid');

-- Tag the todo
INSERT INTO todo_tags (todo_id, tag_id) VALUES
('todo1-uuid', 'tag1-uuid');

-- Assign tags directly to user (if needed)
INSERT INTO user_tags (user_id, tag_id) VALUES
('user1-uuid', 'tag1-uuid');


 /*
Executing the Queries
1. Actor1 Queries All Collaborators Based on Their Todos


 */

 -- Set user_id to 'user1-uuid'

 -- Execute the first query with ':user_id' replaced
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
     t.creator_id = 'user1-uuid'
     OR t.id IN (
         SELECT todo_id FROM todo_collaborators WHERE user_id = 'user1-uuid'
     )
     AND ac.id != 'user1-uuid';


   /*


collaborator_id	collaborator_name	collaborator_email
user2-uuid	Bob	bob@example.com
user3-uuid	Charlie	charlie@example.com

   2. Actor1 Queries All Tags Based on Their Todos

   */


   -- Set user_id to 'user1-uuid'

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
       t.creator_id = 'user1-uuid'
       OR t.id IN (
           SELECT todo_id FROM todo_collaborators WHERE user_id = 'user1-uuid'
       );



/*
Expected Result:

tag_id	tag_name
tag1-uuid	Work


3. Actor1 Queries All Collaborators Based on a Single Todo


*/

-- Set todo_id to 'todo1-uuid'
-- Set user_id to 'user1-uuid'

SELECT
    ac.id AS collaborator_id,
    ac.name AS collaborator_name,
    ac.email AS collaborator_email
FROM
    todo_collaborators tc
INNER JOIN
    users ac ON tc.user_id = ac.id
WHERE
    tc.todo_id = 'todo1-uuid'
    AND ac.id != 'user1-uuid';


  /*

  Expected Result:

  collaborator_id	collaborator_name	collaborator_email
  user2-uuid	Bob	bob@example.com
  user3-uuid	Charlie	charlie@example.com

4. Actor1 Queries All Collaborators Based on a Tag
*/

-- Set tag_name to 'Work'
-- Set user_id to 'user1-uuid'

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
    tg.name = 'Work'
    AND (t.creator_id = 'user1-uuid'
        OR t.id IN (
            SELECT todo_id FROM todo_collaborators WHERE user_id = 'user1-uuid'
        ))
    AND ac.id != 'user1-uuid';



    /*
    Expected Result:

    collaborator_id	collaborator_name	collaborator_email
    user2-uuid	Bob	bob@example.com
    user3-uuid	Charlie	charlie@example.com



    *