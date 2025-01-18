-- db.migration01.sql

-- Enable the pgcrypto extension for UUID generation (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS Users
(
    id                  UUID                         DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id             VARCHAR(255) UNIQUE NOT NULL,
    tenant              VARCHAR(255),
    username            VARCHAR(255),
    email               VARCHAR(255) UNIQUE NOT NULL,
    phone_number        VARCHAR(20),
    created_at          TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    email_verified      BOOLEAN             NOT NULL,
    family_name         VARCHAR(255),
    given_name          VARCHAR(255),
    last_password_reset TIMESTAMPTZ,
    name                VARCHAR(255),
    nickname            VARCHAR(255),
    phone_verified      BOOLEAN,
    picture             TEXT,
    app_metadata        JSONB                        DEFAULT '{}'::jsonb,
    user_metadata       JSONB                        DEFAULT '{}'::jsonb
);


-- Create 'todos' table
CREATE TABLE IF NOT EXISTS todos
(
    id         UUID PRIMARY KEY     DEFAULT gen_random_uuid(),
    creator_id UUID        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    data       JSONB       NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create 'todo_collaborators' table for many-to-many relationship between todos and users
CREATE TABLE IF NOT EXISTS todo_collaborators
(
    todo_id  UUID        NOT NULL REFERENCES todos (id) ON DELETE CASCADE,
    user_id UUID        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (todo_id, user_id)
);

-- Indexes for faster queries (optional)
CREATE INDEX IF NOT EXISTS idx_todo_creator ON todos (creator_id);
CREATE INDEX IF NOT EXISTS idx_collaborator_todo ON todo_collaborators (todo_id);
CREATE INDEX IF NOT EXISTS idx_collaborator_user ON todo_collaborators (user_id);