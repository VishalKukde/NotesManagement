import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import noteService, { AppError } from '@/services/note.service';
import { updateNoteSchema } from '@/validators/note.schema';
import { ApiResponse } from '@/types/note.types';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/constants/api';

/**
 * GET /api/notes/:id
 * Get single note by ID
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;

    const note = await noteService.getNoteById(id);

    const response: ApiResponse = {
      success: true,
      message: SUCCESS_MESSAGES.NOTES_FETCHED,
      data: note,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('GET /api/notes/:id error:', error);

    if (error instanceof AppError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
          error: error.message,
        },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: ERROR_MESSAGES.INTERNAL_ERROR,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/notes/:id
 * Update note by ID
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;
    const body = await request.json();

    // Validate input
    const validatedData = updateNoteSchema.parse(body);

    const note = await noteService.updateNote(id, validatedData);

    const response: ApiResponse = {
      success: true,
      message: SUCCESS_MESSAGES.NOTE_UPDATED,
      data: note,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('PUT /api/notes/:id error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          message: ERROR_MESSAGES.VALIDATION_ERROR,
          error: error.errors[0].message,
        },
        { status: 400 }
      );
    }

    if (error instanceof AppError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
          error: error.message,
        },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: ERROR_MESSAGES.INTERNAL_ERROR,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/notes/:id
 * Delete note by ID
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;

    await noteService.deleteNote(id);

    const response: ApiResponse = {
      success: true,
      message: SUCCESS_MESSAGES.NOTE_DELETED,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('DELETE /api/notes/:id error:', error);

    if (error instanceof AppError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
          error: error.message,
        },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: ERROR_MESSAGES.INTERNAL_ERROR,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
