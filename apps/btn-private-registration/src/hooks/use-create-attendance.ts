import { useMutation } from "@tanstack/react-query";
import { attendance } from "src/lib/api";

interface UseCreateAttendanceResponse {
  createAttendance: (participantId: string) => void;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  isSuccess: boolean;
}

const useCreateAttendance = (): UseCreateAttendanceResponse => {
  const {
    mutate: createAttendance,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: async (participantId: string) => {
      const response = await attendance.create(participantId);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
  });

  return {
    createAttendance,
    isPending,
    isError,
    error: error as Error | null,
    isSuccess,
  };
};

export default useCreateAttendance;
