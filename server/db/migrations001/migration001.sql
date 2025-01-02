-- db.migration01.sql

-- Enable the pgcrypto extension for UUID generation (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create 'actors' table (previously 'users')
CREATE TABLE IF NOT EXISTS actors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create 'todos' table
CREATE TABLE IF NOT EXISTS todos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES actors(id) ON DELETE CASCADE,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create 'todo_collaborators' table for many-to-many relationship between todos and actors
CREATE TABLE IF NOT EXISTS todo_collaborators (
    todo_id UUID NOT NULL REFERENCES todos(id) ON DELETE CASCADE,
    actor_id UUID NOT NULL REFERENCES actors(id) ON DELETE CASCADE,
    added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (todo_id, actor_id)
);

-- Indexes for faster queries (optional)
CREATE INDEX IF NOT EXISTS idx_todo_creator ON todos(creator_id);
CREATE INDEX IF NOT EXISTS idx_collaborator_todo ON todo_collaborators(todo_id);
CREATE INDEX IF NOT EXISTS idx_collaborator_actor ON todo_collaborators(actor_id);