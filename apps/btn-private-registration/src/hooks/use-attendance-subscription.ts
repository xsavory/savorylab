import { useEffect } from "react";
import { attendance } from "src/lib/api";
import type { AppwriteDocument, Attendance } from "src/types/schema";
import type { RealtimeResponseEvent } from "appwrite";

interface UseAttendanceSubscriptionParams {
  onAttendanceCreate?: (attendance: AppwriteDocument<Attendance>) => void;
}

const useAttendanceSubscription = (params?: UseAttendanceSubscriptionParams) => {
  const { onAttendanceCreate } = params || {};

  useEffect(() => {
    const unsubscribe = attendance.subscribe((payload: RealtimeResponseEvent<AppwriteDocument<Attendance>>) => {
      // Handle create event
      if (payload.events.includes('databases.*.tables.*.rows.*.create') && onAttendanceCreate) {
        onAttendanceCreate(payload.payload);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [onAttendanceCreate]);
};

export default useAttendanceSubscription;
