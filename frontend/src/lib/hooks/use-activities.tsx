import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateActivityRequest,
  Activity,
  UpdateActivityRequest,
} from "../api/types";
import useAxiosInterceptor from "./use-interceptor";

export const useActivities = () => {
  const base = useAxiosInterceptor();

  return useQuery<Activity[], Error>({
    queryKey: ["activities"],
    queryFn: async (): Promise<Activity[]> => {
      const response = await base.get<Activity[]>("/api/activities");
      return response.data;
    },
  });
};

export const useCreateActivity = () => {
  const queryClient = useQueryClient();
  const base = useAxiosInterceptor();

  return useMutation<Activity, Error, CreateActivityRequest>({
    mutationFn: async (activity: CreateActivityRequest): Promise<Activity> => {
      const response = await base.post<Activity>("/api/activities", activity);
      return response.data;
    },
    mutationKey: ["createActivity"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });
};

export const useUpdateActivity = () => {
  const queryClient = useQueryClient();
  const base = useAxiosInterceptor();

  return useMutation<Activity, Error, UpdateActivityRequest>({
    mutationFn: async (activity: UpdateActivityRequest): Promise<Activity> => {
      const response = await base.patch<Activity>(
        `/api/activities/${activity.id}`,
        { name: activity.name }
      );
      return response.data;
    },
    mutationKey: ["updateActivity"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });
};

export const useDeleteActivity = () => {
  const queryClient = useQueryClient();
  const base = useAxiosInterceptor();

  return useMutation<void, Error, string>({
    mutationFn: async (activityId: string): Promise<void> => {
      await base.delete(`/activities/${activityId}`);
    },
    mutationKey: ["deleteActivity"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });
};
