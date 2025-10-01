import { useMutation, useQueryClient } from "@tanstack/react-query";
import { participants, QUERY_KEYS } from "src/lib/api";

interface UseCreateParticipantReturn {
  createParticipant: (data: {
    name: string;
  }) => void;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  isSuccess: boolean;
}

const useCreateParticipant = (): UseCreateParticipantReturn => {
  const queryClient = useQueryClient();

  const {
    mutate: createParticipant,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: async (data: {
      name: string;
    }) => {
      const response = await participants.create(data);
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
    createParticipant,
    isPending,
    isError,
    error: error as Error | null,
    isSuccess,
  };
};

export default useCreateParticipant;
