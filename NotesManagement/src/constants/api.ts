/**
 * API constants
 */

export const API_ENDPOINTS = {
  NOTES: {
    BASE: '/api/notes',
    SEARCH: '/api/notes/search',
  },
} as const;

export const QUERY_KEYS = {
  NOTES: ['notes'] as const,
  NOTE: (id: string) => ['notes', id] as const,
  SEARCH: (query: string) => ['notes', 'search', query] as const,
} as const;

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const ERROR_MESSAGES = {
  VALIDATION_ERROR: 'Validation failed',
  NOT_FOUND: 'Note not found',
  INTERNAL_ERROR: 'Something went wrong',
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
  CONFLICT: 'Note already exists',
  INVALID_ID: 'Invalid note ID',
} as const;

export const SUCCESS_MESSAGES = {
  NOTE_CREATED: 'Note created successfully',
  NOTE_UPDATED: 'Note updated successfully',
  NOTE_DELETED: 'Note deleted successfully',
  NOTES_FETCHED: 'Notes fetched successfully',
  SEARCH_COMPLETED: 'Search completed successfully',
} as const;

export const TOAST_DURATION = 3000;
