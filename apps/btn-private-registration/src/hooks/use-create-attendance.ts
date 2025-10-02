import { useMutation } from "@tanstack/react-query";
import { attendance } from "src/lib/api";
import type { AppwriteDocument, Attendance } from "src/types/schema";

interface UseCreateAttendanceResponse {
  createAttendance: (participantId: string) => void;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  isSuccess: boolean;
  data: AppwriteDocument<Attendance> | undefined;
}

const useCreateAttendance = (): UseCreateAttendanceResponse => {
  const {
    mutate: createAttendance,
    isPending,
    isError,
    error,
    isSuccess,
    data,
  } = useMutation({
    mutationFn: async (participantId: string): Promise<AppwriteDocument<Attendance>> => {
      const response = await attendance.create(participantId);

      if (response.error || !response.data) {
        throw new Error(response.error || "Check-in gagal");
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
    data,
  };
};

export default useCreateAttendance;
