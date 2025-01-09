import { z } from 'zod';

// Zod schema for Actor
export const actorSchema = z.object({
  id: z.string().uuid(),
  name: z.string().max(100),
  email: z.string().email().max(100),
  created_at: z.string().datetime(),
});

// TypeScript type for Actor
export type Actor = z.infer<typeof actorSchema>;

// Zod schema for Todo
export const todoSchema = z.object({
  id: z.string().uuid(),
  creator_id: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  do_state: z.union([z.literal('todo'), z.literal('doing'), z.literal('done')]),
  data: todoBody,
});

export type Todo = z.infer<typeof todoSchema>;

// Base TodoSimple schema
export const todoBody = z.object({
  type: z.literal('data'), // Discriminator field
  title: z.string(),
});


