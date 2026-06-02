'use client';

import React from 'react';
import { INote, PaginatedResponse } from '@/types/note.types';
import { NoteCard } from './NoteCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NoteListProps {
  notes?: INote[];
  pagination?: PaginatedResponse<INote>;
  isLoading?: boolean;
  onDelete: (id: string) => void;
  onPageChange?: (page: number) => void;
  deletingId?: string;
}

/**
 * Note list component with pagination
 */
export function NoteList({
  notes = [],
  pagination,
  isLoading = false,
  onDelete,
  onPageChange,
  deletingId,
}: NoteListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <div className="p-6 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-20" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!notes || notes.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <p className="text-muted-foreground text-lg mb-2">No notes found</p>
            <p className="text-sm text-muted-foreground">
              {pagination?.total === 0
                ? 'Start by creating a new note'
                : 'Try adjusting your search or filters'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <NoteCard
            key={note._id}
            note={note}
            onDelete={onDelete}
            isDeleting={deletingId === note._id}
          />
        ))}
      </div>

      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.pages} (Total: {pagination.total})
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
