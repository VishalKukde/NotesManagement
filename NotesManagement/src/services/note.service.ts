import noteRepository from '@/repositories/note.repository';
import { INote, PaginatedResponse, CreateNotePayload, UpdateNotePayload } from '@/types/note.types';
import { createNoteSchema, updateNoteSchema } from '@/validators/note.schema';
import { ERROR_MESSAGES } from '@/constants/api';

/**
 * Custom error class for API errors
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Note Service - Contains business logic and validation
 */
class NoteService {
  /**
   * Create a new note
   */
  async createNote(data: CreateNotePayload): Promise<INote> {
    try {
      // Validate input
      const validatedData = createNoteSchema.parse(data);

      // Create note
      const note = await noteRepository.create(validatedData);

      return note;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new AppError(400, ERROR_MESSAGES.VALIDATION_ERROR);
      }

      if (error.statusCode) {
        throw error;
      }

      throw new AppError(500, ERROR_MESSAGES.INTERNAL_ERROR);
    }
  }

  /**
   * Get all notes with pagination
   */
  async getNotes(page: number = 1, limit: number = 10): Promise<PaginatedResponse<INote>> {
    try {
      // Validate pagination
      if (page < 1) page = 1;
      if (limit < 1) limit = 10;
      if (limit > 100) limit = 100;

      const result = await noteRepository.findAll(page, limit);

      return result;
    } catch (error: any) {
      if (error.statusCode) {
        throw error;
      }

      throw new AppError(500, ERROR_MESSAGES.INTERNAL_ERROR);
    }
  }

  /**
   * Get single note by ID
   */
  async getNoteById(id: string): Promise<INote> {
    try {
      // Validate ID
      if (!id || typeof id !== 'string') {
        throw new AppError(400, ERROR_MESSAGES.INVALID_ID);
      }

      const note = await noteRepository.findById(id);

      if (!note) {
        throw new AppError(404, ERROR_MESSAGES.NOT_FOUND);
      }

      return note;
    } catch (error: any) {
      if (error.statusCode) {
        throw error;
      }

      if (error.message.includes('invalid id')) {
        throw new AppError(400, ERROR_MESSAGES.INVALID_ID);
      }

      throw new AppError(500, ERROR_MESSAGES.INTERNAL_ERROR);
    }
  }

  /**
   * Update note
   */
  async updateNote(id: string, data: UpdateNotePayload): Promise<INote> {
    try {
      // Validate ID
      if (!id || typeof id !== 'string') {
        throw new AppError(400, ERROR_MESSAGES.INVALID_ID);
      }

      // Validate input
      const validatedData = updateNoteSchema.parse(data);

      // Check if note exists
      const existingNote = await noteRepository.findById(id);
      if (!existingNote) {
        throw new AppError(404, ERROR_MESSAGES.NOT_FOUND);
      }

      // Update note
      const updatedNote = await noteRepository.update(id, validatedData);

      if (!updatedNote) {
        throw new AppError(404, ERROR_MESSAGES.NOT_FOUND);
      }

      return updatedNote;
    } catch (error: any) {
      if (error.statusCode) {
        throw error;
      }

      if (error.name === 'ZodError') {
        throw new AppError(400, ERROR_MESSAGES.VALIDATION_ERROR);
      }

      if (error.message.includes('invalid id')) {
        throw new AppError(400, ERROR_MESSAGES.INVALID_ID);
      }

      throw new AppError(500, ERROR_MESSAGES.INTERNAL_ERROR);
    }
  }

  /**
   * Delete note
   */
  async deleteNote(id: string): Promise<void> {
    try {
      // Validate ID
      if (!id || typeof id !== 'string') {
        throw new AppError(400, ERROR_MESSAGES.INVALID_ID);
      }

      // Check if note exists
      const existingNote = await noteRepository.findById(id);
      if (!existingNote) {
        throw new AppError(404, ERROR_MESSAGES.NOT_FOUND);
      }

      // Delete note
      await noteRepository.delete(id);
    } catch (error: any) {
      if (error.statusCode) {
        throw error;
      }

      if (error.message.includes('invalid id')) {
        throw new AppError(400, ERROR_MESSAGES.INVALID_ID);
      }

      throw new AppError(500, ERROR_MESSAGES.INTERNAL_ERROR);
    }
  }

  /**
   * Search notes
   */
  async searchNotes(
    query: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<INote>> {
    try {
      // Validate search query
      if (!query || typeof query !== 'string' || query.trim() === '') {
        throw new AppError(400, 'Search query is required');
      }

      // Validate pagination
      if (page < 1) page = 1;
      if (limit < 1) limit = 10;
      if (limit > 100) limit = 100;

      const result = await noteRepository.search(query.trim(), page, limit);

      return result;
    } catch (error: any) {
      if (error.statusCode) {
        throw error;
      }

      throw new AppError(500, ERROR_MESSAGES.INTERNAL_ERROR);
    }
  }
}

// Export singleton instance
export default new NoteService();
