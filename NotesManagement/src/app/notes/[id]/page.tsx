'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useNote, useDeleteNote } from '@/hooks/useNotes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DeleteDialog } from '@/components/notes/DeleteDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDateTime } from '@/lib/utils';
import { ArrowLeft, Edit } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ViewNotePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [isDeleting, setIsDeleting] = useState(false);

  const noteQuery = useNote(id);
  const deleteNoteMutation = useDeleteNote(id);

  const { data: note, isLoading, error } = noteQuery;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteNoteMutation.mutateAsync();
      toast.success('Note deleted successfully');
      router.push('/notes');
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
    } finally {
      setIsDeleting(false);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link href="/notes">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Notes
          </Button>
        </Link>
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
          <p className="text-destructive font-medium">Error loading note</p>
          <p className="text-sm text-muted-foreground mt-1">
            {(error as Error)?.message || 'Note not found or cannot be loaded'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/notes">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Notes
        </Button>
      </Link>

      <div className="max-w-3xl mx-auto">
        {isLoading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-96 w-full" />
            </CardContent>
          </Card>
        ) : note ? (
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-3xl">{note.title}</CardTitle>
                  <CardDescription>
                    Created on {formatDateTime(note.createdAt)}
                    {new Date(note.createdAt).getTime() !== new Date(note.updatedAt).getTime() && (
                      <span>
                        {' '}
                        • Updated on {formatDateTime(note.updatedAt)}
                      </span>
                    )}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Content</h3>
                <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap text-sm min-h-[200px]">
                  {note.content || 'No content'}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Link href={`/notes/${note._id}/edit`} className="flex-1">
                  <Button variant="outline" className="w-full" size="lg">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Note
                  </Button>
                </Link>
                <DeleteDialog
                  onConfirm={handleDelete}
                  isLoading={isDeleting}
                  title="Delete Note"
                  description="Are you sure you want to delete this note? This action cannot be undone."
                />
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
