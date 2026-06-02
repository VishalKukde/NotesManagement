'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { useNotes, useSearchNotes } from '@/hooks/useNotes';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/notes/SearchBar';
import { NoteList } from '@/components/notes/NoteList';
import { Plus, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { API_ENDPOINTS } from '@/constants/api';
import { useQueryClient } from '@tanstack/react-query';

export default function NotesPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Queries
  const notesQuery = useNotes(page, 6);
  const searchQuery_ = useSearchNotes(searchQuery, page, 6);
  const isSearching = searchQuery.trim().length > 0;

  // Use appropriate query based on search
  const query = isSearching ? searchQuery_ : notesQuery;
  const { data, isLoading, error } = query;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1); // Reset to first page
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const response = await api.delete(`${API_ENDPOINTS.NOTES.BASE}/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success('Note deleted successfully');
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
    } finally {
      setDeletingId(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
          <p className="text-destructive font-medium">Error loading notes</p>
          <p className="text-sm text-muted-foreground mt-1">
            {(error as Error)?.message || 'Please try again later'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="hover:bg-accent">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold">My Notes</h1>
            <p className="text-muted-foreground mt-1">
              {data?.total ?? 0} note{(data?.total ?? 0) !== 1 ? 's' : ''} total
            </p>
          </div>
        </div>
        <Link href="/notes/create">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Note
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar
          onSearch={handleSearch}
          isLoading={isLoading}
          placeholder="Search notes by title or content..."
        />
      </div>

      {/* Notes List */}
      <NoteList
        notes={data?.data}
        pagination={data}
        isLoading={isLoading}
        onDelete={handleDelete}
        onPageChange={handlePageChange}
        deletingId={deletingId ?? undefined}
      />
    </div>
  );
}
