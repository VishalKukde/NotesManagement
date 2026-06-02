'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { INote, PaginatedResponse, CreateNotePayload, UpdateNotePayload, ApiResponse } from '@/types/note.types';
import { QUERY_KEYS, API_ENDPOINTS } from '@/constants/api';

/**
 * Hook to fetch all notes with pagination
 */
export function useNotes(page: number = 1, limit: number = 6) {
  return useQuery<PaginatedResponse<INote>>({
    queryKey: [...QUERY_KEYS.NOTES, page, limit],
    queryFn: async () => {
      const response = await api.get<ApiResponse<PaginatedResponse<INote>>>(API_ENDPOINTS.NOTES.BASE, {
        params: { page, limit },
      });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch a single note by ID
 */
export function useNote(id: string) {
  return useQuery<INote>({
    queryKey: QUERY_KEYS.NOTE(id),
    queryFn: async () => {
      const response = await api.get<ApiResponse<INote>>(`${API_ENDPOINTS.NOTES.BASE}/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to create a new note
 */
export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation<INote, Error, CreateNotePayload>({
    mutationFn: async (data) => {
      const response = await api.post<ApiResponse<INote>>(API_ENDPOINTS.NOTES.BASE, data);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    },
    onSuccess: () => {
      // Invalidate and refetch notes list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTES });
    },
  });
}

/**
 * Hook to update a note
 */
export function useUpdateNote(id: string) {
  const queryClient = useQueryClient();

  return useMutation<INote, Error, UpdateNotePayload>({
    mutationFn: async (data) => {
      const response = await api.put<ApiResponse<INote>>(`${API_ENDPOINTS.NOTES.BASE}/${id}`, data);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    },
    onSuccess: () => {
      // Invalidate and refetch both single note and notes list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTE(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTES });
    },
  });
}

/**
 * Hook to delete a note
 */
export function useDeleteNote(id?: string) {
  const queryClient = useQueryClient();
  const noteId = id || '';

  return useMutation<void, Error>({
    mutationFn: async () => {
      const response = await api.delete<ApiResponse>(`${API_ENDPOINTS.NOTES.BASE}/${noteId}`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
    },
    onSuccess: () => {
      // Invalidate notes list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTES });
      if (noteId) {
        queryClient.removeQueries({ queryKey: QUERY_KEYS.NOTE(noteId) });
      }
    },
  });
}

/**
 * Hook to search notes
 */
export function useSearchNotes(query: string, page: number = 1, limit: number = 5) {
  return useQuery<PaginatedResponse<INote>>({
    queryKey: QUERY_KEYS.SEARCH(query),
    queryFn: async () => {
      const response = await api.get<ApiResponse<PaginatedResponse<INote>>>(
        API_ENDPOINTS.NOTES.SEARCH,
        {
          params: { q: query, page, limit },
        }
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    },
    enabled: !!query && query.trim().length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
