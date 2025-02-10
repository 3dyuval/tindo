import { z } from 'zod';

// Zod schema for Actor
export const actorSchema = z.object({
  id: z.string().uuid(),
  name: z.string().max(100),
  email: z.string().email().max(100),
  created_at: z.string().datetime()
});

// TypeScript type for Actor
export type Actor = z.infer<typeof actorSchema>;


const listItemSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('text'),
    title: z.string()
  }),
  z.object({
    type: z.literal('todo'),
    title: z.string(),
    completed: z.boolean(),
    due_date: z.string().datetime().optional()
  })
])


export const itemDataSchema = z.object({
  type: z.string(),
  category: z.string(),
  title: z.string().optional(),
  list: z.array(listItemSchema).optional(),
  priority: z.number().min(-3).max(3).default(0)
})


// Zod schema for Todo
export const itemSchema = z.object({
  id: z.string().uuid(),
  creator_id: z.string(),
  created_at: z.string(),
  updated_by: z.string().optional(),
  updated_at: z.string().optional(),
  data: itemDataSchema
})

export type Item = z.infer<typeof itemSchema>;
export type ItemDate = z.infer<typeof itemDataSchema>;

const config = z.object({
  boardTypes: z.record(z.string(), z.array(z.string())),
  dateString: z.string(),
  disableConfirmAddItem: z.boolean()
})

export type UserConfig = z.infer<typeof config>;