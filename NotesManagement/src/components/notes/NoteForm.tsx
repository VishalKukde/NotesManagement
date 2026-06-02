'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createNoteSchema, CreateNoteInput } from '@/validators/note.schema';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface NoteFormProps {
  onSubmit: (data: CreateNoteInput) => Promise<void>;
  isLoading?: boolean;
  defaultValues?: CreateNoteInput;
  isEditMode?: boolean;
}

/**
 * Note form component with validation
 */
export function NoteForm({
  onSubmit,
  isLoading = false,
  defaultValues,
  isEditMode = false,
}: NoteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateNoteInput>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: defaultValues || {
      title: '',
      content: '',
    },
  });

  const handleSubmit = async (data: CreateNoteInput) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to save note. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading_ = isLoading || isSubmitting;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? 'Edit Note' : 'Create New Note'}</CardTitle>
        <CardDescription>
          {isEditMode ? 'Update your note details' : 'Add a new note to your collection'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }:any) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter note title..."
                      {...field}
                      disabled={isLoading_}
                    />
                  </FormControl>
                  <FormDescription>
                    The title of your note (required)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }:any) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter note content..."
                      className="min-h-[200px]"
                      {...field}
                      disabled={isLoading_}
                    />
                  </FormControl>
                  <FormDescription>
                    The main content of your note (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3">
              <Button type="submit" disabled={isLoading_} className="flex-1">
                {isLoading_ ? 'Saving...' : isEditMode ? 'Update Note' : 'Create Note'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
