'use client';

import React from 'react';
import Link from 'next/link';
import { INote } from '@/types/note.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDateTime, truncate } from '@/lib/utils';
import { Edit, Loader2, Trash2 } from 'lucide-react';

interface NoteCardProps {
  note: INote;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function NoteCard({ note, onDelete, isDeleting = false }: NoteCardProps) {
  return (
    <Card className="border border-neutral-100 shadow-md hover:shadow-xl transition-shadow">
      <Link href={`/notes/${note._id}`}>
        <CardHeader className="cursor-pointer transition-colors rounded-t-lg">
          <CardTitle className="text-lg line-clamp-2">{note.title}</CardTitle>
          <CardDescription>{formatDateTime(note.createdAt)}</CardDescription>
        </CardHeader>
        <CardContent className="cursor-pointer pb-0">
          <p className="text-sm text-foreground/70 line-clamp-3 pb-4">
            {truncate(note.content || 'No content', 150)}
          </p>
        </CardContent>
      </Link>

      <CardContent className="pt-4 flex gap-2">
        <Link href={`/notes/${note._id}/edit`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </Link>
 <Button
  variant="destructive"
  size="sm"
  onClick={() => onDelete(note._id)}
  disabled={isDeleting}
>
  {isDeleting ? (
    <Loader2 className="w-4 h-4 animate-spin" />
  ) : (
    <Trash2 className="w-4 h-4" />
  )}
</Button>
      </CardContent>
    </Card>
  );
}
