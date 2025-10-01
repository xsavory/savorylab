import { useMutation, useQueryClient } from "@tanstack/react-query";
import { participants, QUERY_KEYS } from "src/lib/api";

interface UseUpdateParticipantResponse {
  updateParticipant: (data: {
    id: string;
    updates: {
      name?: string;
      isCheckedIn?: boolean;
    };
  }) => void;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  isSuccess: boolean;
}

const useUpdateParticipant = (): UseUpdateParticipantResponse => {
  const queryClient = useQueryClient();

  const {
    mutate: updateParticipant,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: async (data: {
      id: string;
      updates: {
        name?: string;
        isCheckedIn?: boolean;
      };
    }) => {
      const response = await participants.update(data.id, data.updates);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.participants });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
    },
  });

  return {
    updateParticipant,
    isPending,
    isError,
    error: error as Error | null,
    isSuccess,
  };
};

export default useUpdateParticipant;
