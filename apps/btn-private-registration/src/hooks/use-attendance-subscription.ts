import { useEffect, useState } from "react";
import { attendance } from "src/lib/api";
import type { AppwriteDocument, Attendance } from "src/types/schema";
import type { RealtimeResponseEvent } from "appwrite";

const useAttendanceSubscription = () => {
  const [latestCheckIn, setLatestCheckIn] = useState<Attendance | null>(null)

  useEffect(() => {
    const unsubscribe = attendance.subscribe((payload: RealtimeResponseEvent<AppwriteDocument<Attendance>>) => {
      console.log(payload, '====hooks')
      // Handle create event
      if (payload.events.includes('databases.*.tables.*.rows.*.create')) {
        setLatestCheckIn(payload.payload);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { latestCheckIn }
};

export default useAttendanceSubscription;
