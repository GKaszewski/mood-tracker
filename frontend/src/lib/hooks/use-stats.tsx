import { useQuery } from "@tanstack/react-query";
import useAxiosInterceptor from "./use-interceptor";
import { GetMoodTrendRequest, MoodTrend } from "../api/types";

export const useMoodTrend = (params: GetMoodTrendRequest) => {
  const base = useAxiosInterceptor();

  return useQuery<MoodTrend, Error>({
    queryKey: ["mood-trend", params],
    queryFn: async (): Promise<MoodTrend> => {
      const response = await base.get<MoodTrend>("/api/stats/mood-trend", {
        params,
      });
      return response.data;
    },
  });
};
