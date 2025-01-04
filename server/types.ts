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
  data: z.record(z.any()),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// TypeScript type for Todo
export type Todo = z.infer<typeof todoSchema>;