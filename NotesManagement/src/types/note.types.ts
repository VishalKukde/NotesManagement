/**
 * Note type definitions
 */

export interface INote {
  _id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNotePayload {
  title: string;
  content?: string;
}

export interface UpdateNotePayload {
  title?: string;
  content?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface ApiError {
  success: false;
  message: string;
  error: string;
}
