
/*
Testing the Queries
Sample Data Insertion
Let's insert some sample data to test the queries.


SQL Query:
*/
-- Insert Actors
INSERT INTO actors (id, name, email) VALUES
('actor1-uuid', 'Alice', 'alice@example.com'),
('actor2-uuid', 'Bob', 'bob@example.com'),
('actor3-uuid', 'Charlie', 'charlie@example.com');

-- Insert Tags
INSERT INTO tags (id, name) VALUES
('tag1-uuid', 'Work'),
('tag2-uuid', 'Personal');

-- Actor1 creates a todo
INSERT INTO todos (id, creator_id, data) VALUES
('todo1-uuid', 'actor1-uuid', '{"title": "Project Proposal"}');

-- Actor1 adds collaborators to the todo
INSERT INTO todo_collaborators (todo_id, actor_id) VALUES
('todo1-uuid', 'actor2-uuid'),
('todo1-uuid', 'actor3-uuid');

-- Tag the todo
INSERT INTO todo_tags (todo_id, tag_id) VALUES
('todo1-uuid', 'tag1-uuid');

-- Assign tags directly to actor (if needed)
INSERT INTO actor_tags (actor_id, tag_id) VALUES
('actor1-uuid', 'tag1-uuid');


 /*
Executing the Queries
1. Actor1 Queries All Collaborators Based on Their Todos


 */
 
 -- Set actor_id to 'actor1-uuid'
 
 -- Execute the first query with ':actor_id' replaced
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
     t.creator_id = 'actor1-uuid'
     OR t.id IN (
         SELECT todo_id FROM todo_collaborators WHERE actor_id = 'actor1-uuid'
     )
     AND ac.id != 'actor1-uuid';
     
     
   /*
   
   
collaborator_id	collaborator_name	collaborator_email
actor2-uuid	Bob	bob@example.com
actor3-uuid	Charlie	charlie@example.com

   2. Actor1 Queries All Tags Based on Their Todos
   
   */
   
   
   -- Set actor_id to 'actor1-uuid'
   
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
       t.creator_id = 'actor1-uuid'
       OR t.id IN (
           SELECT todo_id FROM todo_collaborators WHERE actor_id = 'actor1-uuid'
       );
   


/*
Expected Result:

tag_id	tag_name
tag1-uuid	Work


3. Actor1 Queries All Collaborators Based on a Single Todo


*/

-- Set todo_id to 'todo1-uuid'
-- Set actor_id to 'actor1-uuid'

SELECT
    ac.id AS collaborator_id,
    ac.name AS collaborator_name,
    ac.email AS collaborator_email
FROM
    todo_collaborators tc
INNER JOIN
    actors ac ON tc.actor_id = ac.id
WHERE
    tc.todo_id = 'todo1-uuid'
    AND ac.id != 'actor1-uuid';
    
    
  /*
  
  Expected Result:
  
  collaborator_id	collaborator_name	collaborator_email
  actor2-uuid	Bob	bob@example.com
  actor3-uuid	Charlie	charlie@example.com

4. Actor1 Queries All Collaborators Based on a Tag
*/

-- Set tag_name to 'Work'
-- Set actor_id to 'actor1-uuid'

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
    tg.name = 'Work'
    AND (t.creator_id = 'actor1-uuid'
        OR t.id IN (
            SELECT todo_id FROM todo_collaborators WHERE actor_id = 'actor1-uuid'
        ))
    AND ac.id != 'actor1-uuid';
    
    
    
    /*
    Expected Result:
    
    collaborator_id	collaborator_name	collaborator_email
    actor2-uuid	Bob	bob@example.com
    actor3-uuid	Charlie	charlie@example.com


    
    *