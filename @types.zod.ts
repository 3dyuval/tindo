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
export const itemSchema = z.object({
  id: z.string().uuid(),
  creator_id: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  type: z.string(),
  category: z.string(),
  body: z.object({
    title: z.string(),
  })
})

export type Item = z.infer<typeof itemSchema>;

const boardConfig = z.object({
  boardTypes: z.record(z.string(), z.array(z.string()))
})

export type BoardConfig = z.infer<typeof boardConfig>;