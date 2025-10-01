import { useMutation, useQueryClient } from "@tanstack/react-query";
import { participants, QUERY_KEYS } from "src/lib/api";

interface UseDeleteParticipantReturn {
  deleteParticipant: (id: string) => void;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  isSuccess: boolean;
}

const useDeleteParticipant = (): UseDeleteParticipantReturn => {
  const queryClient = useQueryClient();

  const {
    mutate: deleteParticipant,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: async (id: string) => {
      const response = await participants.delete(id);
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
    deleteParticipant,
    isPending,
    isError,
    error: error as Error | null,
    isSuccess,
  };
};

export default useDeleteParticipant;
