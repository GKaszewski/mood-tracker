import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateMoodEntryRequest,
  MoodEntry,
  UpdateMoodEntryRequest,
} from "../api/types";
import useAxiosInterceptor from "./use-interceptor";

export const useMoodEntries = () => {
  const base = useAxiosInterceptor();

  return useQuery<MoodEntry[], Error>({
    queryKey: ["moods"],
    queryFn: async (): Promise<MoodEntry[]> => {
      const response = await base.get<MoodEntry[]>("/api/moods");
      return response.data;
    },
  });
};

export const useCreateMoodEntry = () => {
  const queryClient = useQueryClient();
  const base = useAxiosInterceptor();

  return useMutation<MoodEntry, Error, CreateMoodEntryRequest>({
    mutationFn: async (moodEntry: CreateMoodEntryRequest) => {
      const response = await base.post<MoodEntry>("/api/moods", moodEntry);
      return response.data;
    },
    mutationKey: ["createMoodEntry"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moods"] });
    },
  });
};

export const useUpdateMoodEntry = () => {
  const queryClient = useQueryClient();
  const base = useAxiosInterceptor();

  return useMutation<MoodEntry, Error, UpdateMoodEntryRequest>({
    mutationFn: async (moodEntry: UpdateMoodEntryRequest) => {
      const response = await base.patch<MoodEntry>(
        `/api/moods/${moodEntry.id}`,
        { mood: moodEntry.mood }
      );
      return response.data;
    },
    mutationKey: ["updateMoodEntry"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moods"] });
    },
  });
};

export const useDeleteMoodEntry = () => {
  const queryClient = useQueryClient();
  const base = useAxiosInterceptor();

  return useMutation<void, Error, string>({
    mutationFn: async (moodEntryId: string) => {
      await base.delete(`/api/moods/${moodEntryId}`);
      return;
    },
    mutationKey: ["deleteMoodEntry"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moods"] });
    },
  });
};
