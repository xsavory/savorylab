import { useQuery } from "@tanstack/react-query";
import { participants, QUERY_KEYS } from "src/lib/api";
import type { Participant, AppwriteDocument } from "src/types/schema";

interface UseParticipantsParams {
  limit?: number;
  offset?: number;
  searchName?: string;
  isCheckedIn?: boolean;
}

interface UseParticipantsResponse {
  participants: AppwriteDocument<Participant>[] | undefined;
  total: number;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

const useParticipants = (params?: UseParticipantsParams): UseParticipantsResponse => {
  const {
    data: participantsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [...QUERY_KEYS.participants, params],
    queryFn: async () => {
      const response = await participants.getAll(params);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  // Note: Realtime subscription removed from here to avoid multiple subscriptions
  // Subscription is handled globally in useParticipantStats hook instead

  return {
    participants: participantsData?.rows,
    total: participantsData?.total ?? 0,
    isLoading,
    isError,
    error: error as Error | null,
  };
};

export default useParticipants;
