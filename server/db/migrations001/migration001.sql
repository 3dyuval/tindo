-- db.migration01.sql

-- Enable the pgcrypto extension for UUID generation (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create 'actors' table (previously 'users')
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create 'todos' table
CREATE TABLE IF NOT EXISTS todos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create 'todo_collaborators' table for many-to-many relationship between todos and actors
CREATE TABLE IF NOT EXISTS todo_collaborators (
    todo_id TEXT NOT NULL REFERENCES todos(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (todo_id, user_id)
);

-- Indexes for faster queries (optional)
CREATE INDEX IF NOT EXISTS idx_todo_creator ON todos(user_id);
CREATE INDEX IF NOT EXISTS idx_collaborator_todo ON todo_collaborators(todo_id);
CREATE INDEX IF NOT EXISTS idx_collaborator_user ON todo_collaborators(user_id);