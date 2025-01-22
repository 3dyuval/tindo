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


// Zod schema for Todo
export const itemSchema = z.object({
  id: z.string().uuid(),
  created_by: z.string().uuid(),
  created_at: z.coerce.date(),
  updated_by: z.string().uuid().optional(),
  updated_at: z.coerce.date().optional(),
  body: z.object({
    type: z.string(),
    category: z.string(),
    title: z.string().optional(),
    list: z.array(listItemSchema).optional(),
    priority: z.number().min(-3).max(3).default(0)
  })
})


export type Item = z.infer<typeof itemSchema>;

const config = z.object({
  boardTypes: z.record(z.string(), z.array(z.string())),
  dateString: z.string(),
  disableConfirmAddItem: z.boolean()
})

export type UserConfig = z.infer<typeof config>;