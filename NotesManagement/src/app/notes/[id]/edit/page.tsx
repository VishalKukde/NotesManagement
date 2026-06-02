'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useNote, useUpdateNote } from '@/hooks/useNotes';
import { NoteForm } from '@/components/notes/NoteForm';
import { CreateNoteInput } from '@/validators/note.schema';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function EditNotePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const noteQuery = useNote(id);
  const updateNoteMutation = useUpdateNote(id);

  const { data: note, isLoading, error } = noteQuery;

  const handleSubmit = async (data: CreateNoteInput) => {
    try {
      await updateNoteMutation.mutateAsync(data);
      toast.success('Note updated successfully!');
      router.push(`/notes/${id}`);
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error('Failed to update note. Please try again.');
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
      <Link href={`/notes`}>
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Note
        </Button>
      </Link>

      <div className="max-w-2xl mx-auto">
        {isLoading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-1/3 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Skeleton className="h-10 w-full mb-2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <div>
                <Skeleton className="h-48 w-full mb-2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-10 flex-1" />
              </div>
            </CardContent>
          </Card>
        ) : note ? (
          <NoteForm
            onSubmit={handleSubmit}
            isLoading={updateNoteMutation.isPending}
            defaultValues={{
              title: note.title,
              content: note.content,
            }}
            isEditMode
          />
        ) : null}
      </div>
    </div>
  );
}
