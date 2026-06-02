import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import noteService, { AppError } from '@/services/note.service';
import { searchSchema } from '@/validators/note.schema';
import { ApiResponse } from '@/types/note.types';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/constants/api';

/**
 * GET /api/notes/search
 * Search notes by query
 */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');

    // Validate search params
    const { q, page: validatedPage, limit: validatedLimit } = searchSchema.parse({
      q: query || '',
      page: page || 1,
      limit: limit || 10,
    });

    const result = await noteService.searchNotes(q, validatedPage, validatedLimit);

    const response: ApiResponse = {
      success: true,
      message: SUCCESS_MESSAGES.SEARCH_COMPLETED,
      data: result,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('GET /api/notes/search error:', error);

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
