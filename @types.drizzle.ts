import { pgTable, uuid, varchar, timestamp, integer, jsonb } from 'drizzle-orm/pg-core';
import { pool } from './server/utils/useDb'

import { drizzle } from 'drizzle-orm/node-postgres';

import { config } from 'dotenv'
config({ path: '.src/.env' })
// Initialize Drizzle ORM
export const db = drizzle(process.env.DB_URL as string);

/**
 * Actors Table
 */
export const actors = pgTable('actors', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

/**
 * Todos Table
 */
export const todos = pgTable('todos', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  creator_id: uuid('creator_id')
      .notNull()
      .references(() => actors.id, { onDelete: 'cascade' }),
  data: jsonb('data').default('{}').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
  do_state: varchar('do_state', { length: 10 }).notNull(),
});

/**
 * Todo Collaborators Table
 */
export const todo_collaborators = pgTable('todo_collaborators', {
  todo_id: uuid('todo_id')
      .notNull()
      .references(() => todos.id, { onDelete: 'cascade' }),
  actor_id: uuid('actor_id')
      .notNull()
      .references(() => actors.id, { onDelete: 'cascade' }),
  added_at: timestamp('added_at').defaultNow().notNull(),
}, (tc) => ({
  pk: tc.primaryKey(tc.todo_id, tc.actor_id),
}));

/**
 * Tags Table
 */
export const tags = pgTable('tags', {
  tag_id: varchar('tag_id', { length: 50 }).primaryKey().unique(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

/**
 * Actor Tags Table
 */
export const actor_tags = pgTable('actor_tags', {
  actor_id: uuid('actor_id')
      .notNull()
      .references(() => actors.id, { onDelete: 'cascade' }),
  tag_id: varchar('tag_id', { length: 50 })
      .notNull()
      .references(() => tags.tag_id, { onDelete: 'cascade' }),
  assigned_at: timestamp('assigned_at').defaultNow().notNull(),
}, (at) => ({
  pk: at.primaryKey(at.actor_id, at.tag_id),
}));

/**
 * Todo Tags Table
 */
export const todo_tags = pgTable('todo_tags', {
  todo_id: uuid('todo_id')
      .notNull()
      .references(() => todos.id, { onDelete: 'cascade' }),
  tag_id: varchar('tag_id', { length: 50 })
      .notNull()
      .references(() => tags.tag_id, { onDelete: 'cascade' }),
  assigned_at: timestamp('assigned_at').defaultNow().notNull(),
}, (tt) => ({
  pk: tt.primaryKey(tt.todo_id, tt.tag_id),
}));