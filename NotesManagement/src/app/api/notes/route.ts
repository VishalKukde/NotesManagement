import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import noteService, { AppError } from '@/services/note.service';
import { paginationSchema, createNoteSchema } from '@/validators/note.schema';
import { ApiResponse } from '@/types/note.types';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/constants/api';

/**
 * GET /api/notes
 * Get all notes with pagination
 */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');

    // Validate pagination params
    const { page: validatedPage, limit: validatedLimit } = paginationSchema.parse({
      page: page || 1,
      limit: limit || 10,
    });

    const result = await noteService.getNotes(validatedPage, validatedLimit);

    const response: ApiResponse = {
      success: true,
      message: SUCCESS_MESSAGES.NOTES_FETCHED,
      data: result,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('GET /api/notes error:', error);

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
 * POST /api/notes
 * Create a new note
 */
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    // Validate input
    const validatedData = createNoteSchema.parse(body);

    const note = await noteService.createNote(validatedData);

    const response: ApiResponse = {
      success: true,
      message: SUCCESS_MESSAGES.NOTE_CREATED,
      data: note,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/notes error:', error);

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
