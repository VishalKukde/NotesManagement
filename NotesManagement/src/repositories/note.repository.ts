import Note, { INoteDocument } from '@/models/Note';
import { INote, PaginatedResponse, CreateNotePayload, UpdateNotePayload } from '@/types/note.types';

/**
 * Note Repository - Handles all database operations
 */
class NoteRepository {
  /**
   * Create a new note
   */
  async create(data: CreateNotePayload): Promise<INote> {
    const note = await Note.create(data);
    return this.toINote(note);
  }

  /**
   * Find all notes with pagination
   */
  async findAll(page: number = 1, limit: number = 10): Promise<PaginatedResponse<INote>> {
    const skip = (page - 1) * limit;

    const [notes, total] = await Promise.all([
      Note.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Note.countDocuments(),
    ]);

    const pages = Math.ceil(total / limit);

    return {
      data: notes.map((note) => this.toINote(note)),
      total,
      page,
      limit,
      pages,
    };
  }

  /**
   * Find note by ID
   */
  async findById(id: string): Promise<INote | null> {
    const note = await Note.findById(id);
    return note ? this.toINote(note) : null;
  }

  /**
   * Update note by ID
   */
  async update(id: string, data: UpdateNotePayload): Promise<INote | null> {
    const note = await Note.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    return note ? this.toINote(note) : null;
  }

  /**
   * Delete note by ID
   */
  async delete(id: string): Promise<boolean> {
    const result = await Note.findByIdAndDelete(id);
    return result !== null;
  }

  /**
   * Search notes by title and content
   */
  async search(
    query: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<INote>> {
    const skip = (page - 1) * limit;

    const [notes, total] = await Promise.all([
      Note.find(
        { $text: { $search: query } },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .skip(skip)
        .limit(limit),
      Note.countDocuments({ $text: { $search: query } }),
    ]);

    const pages = Math.ceil(total / limit);

    return {
      data: notes.map((note) => this.toINote(note)),
      total,
      page,
      limit,
      pages,
    };
  }

  /**
   * Delete all notes (for testing purposes)
   */
  async deleteAll(): Promise<void> {
    await Note.deleteMany({});
  }

  /**
   * Convert Mongoose document to INote interface
   */
  private toINote(doc: INoteDocument): INote {
    return {
      _id: doc._id.toString(),
      title: doc.title,
      content: doc.content,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}

// Export singleton instance
export default new NoteRepository();
