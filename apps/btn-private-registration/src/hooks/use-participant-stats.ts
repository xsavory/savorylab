import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { participants, attendance, QUERY_KEYS } from "src/lib/api";

interface UseParticipantStatsReturn {
  stats: {
    total: number;
    checkedIn: number;
    notCheckedIn: number;
  } | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

const useParticipantStats = (): UseParticipantStatsReturn => {
  const queryClient = useQueryClient();

  const {
    data: stats,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.stats,
    queryFn: async () => {
      const response = await participants.getStats();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  // Subscribe to attendance realtime for invalidating queries globally
  // This subscription handles invalidation for both stats and participants
  useEffect(() => {
    const unsubscribe = attendance.subscribe((payload) => {
      if (payload.events.includes('databases.*.tables.*.rows.*.create')) {
        // Invalidate both stats and participants when attendance changes
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.participants });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient]);

  return {
    stats: stats ?? undefined,
    isLoading,
    isError,
    error: error as Error | null,
  };
};

export default useParticipantStats;
