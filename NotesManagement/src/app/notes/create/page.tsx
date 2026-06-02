'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCreateNote } from '@/hooks/useNotes';
import { NoteForm } from '@/components/notes/NoteForm';
import { CreateNoteInput } from '@/validators/note.schema';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateNotePage() {
  const router = useRouter();
  const createNoteMutation = useCreateNote();

  const handleSubmit = async (data: CreateNoteInput) => {
    try {
      await createNoteMutation.mutateAsync(data);
      toast.success('Note created successfully!');
      router.push('/notes');
    } catch (error) {
      console.error('Error creating note:', error);
      toast.error('Failed to create note. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/notes">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Notes
        </Button>
      </Link>

      <div className="max-w-2xl mx-auto">
        <NoteForm
          onSubmit={handleSubmit}
          isLoading={createNoteMutation.isPending}
        />
      </div>
    </div>
  );
}
