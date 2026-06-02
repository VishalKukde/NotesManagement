import { z } from 'zod';

/**
 * Validation schemas for notes
 */

export const createNoteSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters')
    .trim(),
  content: z
    .string()
    .max(5000, 'Content must not exceed 5000 characters')
    .optional()
    .default(''),
});

export const updateNoteSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters')
    .trim()
    .optional(),
  content: z
    .string()
    .max(5000, 'Content must not exceed 5000 characters')
    .optional(),
});

export const noteIdSchema = z.object({
  id: z.string().regex(/^[0-9a-f]{24}$/, 'Invalid note ID'),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export const searchSchema = z.object({
  q: z.string().min(1, 'Search query is required').trim(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

// Infer types from schemas
export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
export type NoteIdInput = z.infer<typeof noteIdSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
