import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Note interface extending Mongoose Document
 */
export interface INoteDocument extends Document {
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Note Schema with validation and indexing
 */
const noteSchema = new Schema<INoteDocument>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [200, 'Title must not exceed 200 characters'],
    },
    content: {
      type: String,
      default: '',
      maxlength: [5000, 'Content must not exceed 5000 characters'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * Text indexes for full-text search
 */
noteSchema.index({ title: 'text', content: 'text' });

/**
 * Index for sorting by creation date
 */
noteSchema.index({ createdAt: -1 });
noteSchema.index({ updatedAt: -1 });

/**
 * Note Model
 */
const Note: Model<INoteDocument> =
  mongoose.models.Note || mongoose.model<INoteDocument>('Note', noteSchema);

export default Note;
