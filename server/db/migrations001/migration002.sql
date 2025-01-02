-- db.migration02.sql

-- Create 'tags' table
CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create 'actor_tags' table for many-to-many relationship between actors and tags
CREATE TABLE IF NOT EXISTS actor_tags (
    actor_id UUID NOT NULL REFERENCES actors(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (actor_id, tag_id)
);

-- Create 'todo_tags' table for many-to-many relationship between todos and tags
CREATE TABLE IF NOT EXISTS todo_tags (
    todo_id UUID NOT NULL REFERENCES todos(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (todo_id, tag_id)
);

-- Indexes for faster queries (optional)
CREATE INDEX IF NOT EXISTS idx_actor_tags_actor ON actor_tags(actor_id);
CREATE INDEX IF NOT EXISTS idx_actor_tags_tag ON actor_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_todo_tags_todo ON todo_tags(todo_id);
CREATE INDEX IF NOT EXISTS idx_todo_tags_tag ON todo_tags(tag_id);