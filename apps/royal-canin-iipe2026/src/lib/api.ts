import { ID, Query } from "appwrite";
import type { RealtimeResponseEvent } from "appwrite";

import { client, account, databases } from "src/lib/appwrite";
import { formatApiResponse } from "src/lib/utils";
import type {
  AppwriteDocument,
  AppwriteListResponse,
  Participant,
  ActivityLog,
  VetConsultation
} from "src/types/schema";
import { Activity } from "src/types/schema";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const PARTICIPANTS_TABLE_ID = import.meta.env.VITE_APPWRITE_PARTICIPANTS_TABLE_ID;
const ACTIVITY_LOG_TABLE_ID = import.meta.env.VITE_APPWRITE_ACTIVITY_LOG_TABLE_ID;
const VET_CONSULTATION_SHEDULE_TABLE_ID = import.meta.env.VITE_APPWRITE_VET_CONSULTATION_SHEDULE_TABLE_ID;

// React Query keys
export const QUERY_KEYS = {
  participants: ['participants'],
  activityLog: ['activity', 'log'],
  leaderboard: ['participant', 'leaderboard'],
};

/**
 * Admin authentication API
 */
export const adminAuth = {
  /**
   * Sign in with email and password
   */
  signIn: async (email: string, password: string) => {
    try {
      const { userId } = await account.createEmailPasswordSession({ email, password});
      return formatApiResponse({ userId }, null);
    } catch (error) {
      return formatApiResponse<null>(null, error);
    }
  },

  /**
   * Sign out current user
   */
  signOut: async () => {
    try {
      await account.deleteSession({ sessionId: 'current' });
      return formatApiResponse(true, null);
    } catch (error) {
      return formatApiResponse<null>(null, error);
    }
  },

  /**
   * Get current user
   */
  getUser: async () => {
    try {
      const user = await account.get();
      return formatApiResponse({ user }, null);
    } catch (error) {
      return formatApiResponse<null>(null, error);
    }
  },

  /**
   * Listen to authentication state changes
   */
  onAuthStateChange: (callback: (payload: RealtimeResponseEvent<unknown>) => void) => {
    return client.subscribe('account', callback);
  },
}

/**
 * Participants table operations
 */
export const participants = {
  /**
   * Get all participants data
   */
  getAll: async (params?: {
    limit?: number;
    offset?: number;
    searchName?: string;
    searchPhone?: string;
  }) => {
    try {
      const limit = params?.limit || 10;
      const offset = params?.offset || 0;

      const queries = [
        Query.limit(limit),
        Query.offset(offset),
        Query.orderDesc('$createdAt')
      ];

      if (params?.searchName) {
        queries.push(Query.contains('name', params.searchName));
      }

      if (params?.searchPhone) {
        queries.push(Query.contains('phone', params.searchPhone));
      }

      const response = await databases.listRows({
        databaseId: DATABASE_ID,
        tableId: PARTICIPANTS_TABLE_ID,
        queries: queries
      });

      return formatApiResponse<AppwriteListResponse<Participant>>({
        total: response.total,
        rows: response.rows as unknown as AppwriteDocument<Participant>[]
      }, null);
    } catch (error) {
      return formatApiResponse<null>(null, error);
    }
  },

  /**
   * Get all participants for export (no pagination)
   */
  getAllForExport: async () => {
    try {
      const queries = [Query.orderDesc('$createdAt')];

      const response = await databases.listRows({
        databaseId: DATABASE_ID,
        tableId: PARTICIPANTS_TABLE_ID,
        queries: queries
      });

      return formatApiResponse<AppwriteListResponse<Participant>>({
        total: response.total,
        rows: response.rows as unknown as AppwriteDocument<Participant>[]
      }, null);
    } catch (error) {
      return formatApiResponse<null>(null, error);
    }
  },

  /**
   * Get participants leaderboard data
   * Uses materialized points from participants table (instant, scalable)
   */
  getLeaderboards: async () => {
    try {
      const response = await databases.listRows({
        databaseId: DATABASE_ID,
        tableId: PARTICIPANTS_TABLE_ID,
        queries: [
          Query.orderDesc('points'),
          Query.limit(3)
        ]
      });

      return formatApiResponse<AppwriteListResponse<Participant>>({
        total: response.total,
        rows: response.rows as unknown as AppwriteDocument<Participant>[]
      }, null);
    } catch (error) {
      return formatApiResponse<null>(null, error);
    }
  },

  /**
   * Get participant total points
   * Reads from materialized points column in participants table (instant)
   */
  getParticipantPoints: async (participantId: string) => {
    try {
      const response = await databases.getRow({
        databaseId: DATABASE_ID,
        tableId: PARTICIPANTS_TABLE_ID,
        rowId: participantId
      });

      const participant = response as unknown as AppwriteDocument<Participant>;
      const totalPoints = participant.points || 0;

      return formatApiResponse({ total: totalPoints }, null);
    } catch (error) {
      return formatApiResponse<null>(null, error);
    }
  },

  /**
   * Get participants statistics
   * Returns total participants and registrations per day
   */
  getStats: async () => {
    try {
      // Get all participants
      const response = await databases.listRows({
        databaseId: DATABASE_ID,
        tableId: PARTICIPANTS_TABLE_ID,
        queries: [Query.orderAsc('$createdAt')]
      });

      const participants = response.rows as unknown as AppwriteDocument<Participant>[];
      const totalParticipants = response.total;

      // Group registrations by day
      const registrationsByDay: Record<string, number> = {};

      participants.forEach((participant) => {
        if (!participant.$createdAt) return;

        const date = new Date(participant.$createdAt);
        const dateKey = date.toISOString().split('T')[0] as string; // YYYY-MM-DD format

        registrationsByDay[dateKey] = (registrationsByDay[dateKey] || 0) + 1;
      });

      // Get all dates and filter for event dates if they exist
      // If no data exists, still show the 3 event dates with 0 count
      const allDates = Object.keys(registrationsByDay);

      // Event dates: 13, 14, 15 October (adjust year if needed)
      const currentYear = allDates.length > 0 && allDates[0]
        ? new Date(allDates[0]).getFullYear()
        : 2025;

      const eventDates = [
        `${currentYear}-10-13`,
        `${currentYear}-10-14`,
        `${currentYear}-10-15`,
      ];

      // Convert to array format for charts with event dates filter
      const dailyRegistrations = eventDates.map(date => ({
        date,
        count: registrationsByDay[date] || 0,
        displayDate: new Date(date).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short'
        })
      }));

      return formatApiResponse({
        totalParticipants,
        dailyRegistrations
      }, null);
    } catch (error) {
      return formatApiResponse<null>(null, error);
    }
  },

  /**
   * Submit participant quiz result
   * Uses incremental update pattern: read current points, add new points, update
   */
  submitQuizResult: async (data: {
    participantId: string;
    activity: Activity;
    points: number
  }) => {
    try {
      // 1. Read current participant data
      const participantResponse = await databases.getRow({
        databaseId: DATABASE_ID,
        tableId: PARTICIPANTS_TABLE_ID,
        rowId: data.participantId
      });

      const participant = participantResponse as unknown as AppwriteDocument<Participant>;
      const currentPoints = participant.points || 0;
      const newTotalPoints = currentPoints + data.points;

      // 2. Update participant points (incremental)
      await databases.updateRow({
        databaseId: DATABASE_ID,
        tableId: PARTICIPANTS_TABLE_ID,
        rowId: data.participantId,
        data: {
          points: newTotalPoints
        }
      });

      // 3. Create activity log entry (audit trail)
      const activityLogResponse = await databases.createRow({
        databaseId: DATABASE_ID,
        tableId: ACTIVITY_LOG_TABLE_ID,
        rowId: ID.unique(),
        data: {
          participants: data.participantId,
          activity: data.activity,
          points: data.points
        }
      });

      return formatApiResponse<AppwriteDocument<ActivityLog>>(
        activityLogResponse as unknown as AppwriteDocument<ActivityLog>,
        null
      );
    } catch (error) {
      return formatApiResponse<null>(null, error);
    }
  },

  /**
   * Register new participant
   */
  register: async (participant: {
    name: string;
    phone?: string;
  }) => {
    try {
      const response = await databases.createRow({
        databaseId: DATABASE_ID,
        tableId: PARTICIPANTS_TABLE_ID,
        rowId: ID.unique(),
        data: {
          name: participant.name,
          phone: participant.phone,
        }
      });

      return formatApiResponse<AppwriteDocument<Participant>>(
        response as unknown as AppwriteDocument<Participant>,
        null
      );
    } catch (error) {
      return formatApiResponse<null>(null, error);
    }
  },


  /**
   * Subscribe to participant data changes
   */
  subscribe: (callback: (payload: RealtimeResponseEvent<AppwriteDocument<Participant>>) => void) => {
    const channel = `databases.${DATABASE_ID}.tables.${PARTICIPANTS_TABLE_ID}.rows`;
    return client.subscribe(channel, callback);
  },
}

export const activityLog = {
  /**
   * Get all participant activity data
   */
  getAll: async (params?: {
    limit?: number;
    offset?: number;
    searchPhone?: string;
    activity?: Activity;
  }) => {
    try {
      const limit = params?.limit || 10;
      const offset = params?.offset || 0;

      const queries = [
        Query.limit(limit),
        Query.offset(offset),
        Query.orderDesc('$createdAt')
      ];

      if (params?.searchPhone) {
        queries.push(Query.contains('phone', params.searchPhone));
      }

      if (params?.activity !== undefined) {
        queries.push(Query.equal('activity', params.activity));
      }

      const response = await databases.listRows({
        databaseId: DATABASE_ID,
        tableId: ACTIVITY_LOG_TABLE_ID,
        queries: queries
      });

      return formatApiResponse<AppwriteListResponse<ActivityLog>>({
        total: response.total,
        rows: response.rows as unknown as AppwriteDocument<ActivityLog>[]
      }, null);
    } catch (error) {
      return formatApiResponse<null>(null, error);
    }
  },

  getByParticipant: async (participantId: string) => {
    try {
      const response = await databases.listRows({
        databaseId: DATABASE_ID,
        tableId: ACTIVITY_LOG_TABLE_ID,
        queries: [Query.equal("participants", participantId)]
      });

      return formatApiResponse<AppwriteDocument<ActivityLog>>(
        response as unknown as AppwriteDocument<ActivityLog>,
        null
      );
    } catch (error) {
      return formatApiResponse<null>(null, error);
    }
  },

  /**
   * Get all participants activity for export (no pagination)
   */
  getAllForExport: async () => {
    try {
      const queries = [Query.orderDesc('$createdAt')];

      const response = await databases.listRows({
        databaseId: DATABASE_ID,
        tableId: ACTIVITY_LOG_TABLE_ID,
        queries: queries
      });

      return formatApiResponse<AppwriteListResponse<ActivityLog>>({
        total: response.total,
        rows: response.rows as unknown as AppwriteDocument<ActivityLog>[]
      }, null);
    } catch (error) {
      return formatApiResponse<null>(null, error);
    }
  },

  /**
   * Get activity statistics
   * Returns activity counts, trend comparison, and hourly patterns
   */
  getStats: async (params?: { date?: string }) => {
    try {
      // Get all activity logs
      const response = await databases.listRows({
        databaseId: DATABASE_ID,
        tableId: ACTIVITY_LOG_TABLE_ID,
        queries: [Query.orderAsc('$createdAt')]
      });

      const logs = response.rows as unknown as AppwriteDocument<ActivityLog>[];

      // Filter for vet-edu-quiz and sustainability-quiz only
      const targetActivities = [Activity.VetEduQuiz, Activity.SustainabilityQuiz];
      const filteredLogs = logs.filter(log => targetActivities.includes(log.activity));

      // 1. Count participants who played each activity (unique participants)
      const vetEduParticipants = new Set(
        filteredLogs
          .filter(log => log.activity === Activity.VetEduQuiz)
          .map(log => typeof log.participants === 'string' ? log.participants : log.participants.$id)
      );

      const sustainabilityParticipants = new Set(
        filteredLogs
          .filter(log => log.activity === Activity.SustainabilityQuiz)
          .map(log => typeof log.participants === 'string' ? log.participants : log.participants.$id)
      );

      // 2. Activity trend comparison (daily)
      const activityTrend: Record<string, { vetEdu: number; sustainability: number }> = {};

      filteredLogs.forEach(log => {
        if (!log.$createdAt) return;
        const date = new Date(log.$createdAt);
        const dateKey = date.toISOString().split('T')[0] as string;

        if (!activityTrend[dateKey]) {
          activityTrend[dateKey] = { vetEdu: 0, sustainability: 0 };
        }

        if (log.activity === Activity.VetEduQuiz) {
          activityTrend[dateKey].vetEdu += 1;
        } else if (log.activity === Activity.SustainabilityQuiz) {
          activityTrend[dateKey].sustainability += 1;
        }
      });

      // Event dates: 13, 14, 15 October (use year from data or default to 2025)
      const allDates = Object.keys(activityTrend);
      const currentYear = allDates.length > 0 && allDates[0]
        ? new Date(allDates[0]).getFullYear()
        : 2025;

      const eventDates = [
        `${currentYear}-10-13`,
        `${currentYear}-10-14`,
        `${currentYear}-10-15`
      ];

      // Ensure all event dates are included, even with 0 counts
      const trendData = eventDates.map(date => ({
        date,
        vetEdu: activityTrend[date]?.vetEdu || 0,
        sustainability: activityTrend[date]?.sustainability || 0,
        displayDate: new Date(date).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short'
        })
      }));

      // 3. Hourly pattern for specific date (or all dates if not specified)
      const targetDate = params?.date;

      const hourlyPattern = Array.from({ length: 24 }, (_, hour) => ({
        hour,
        displayHour: `${hour.toString().padStart(2, '0')}:00`,
        vetEdu: 0,
        sustainability: 0
      }));

      filteredLogs.forEach(log => {
        if (!log.$createdAt) return;
        const logDate = new Date(log.$createdAt);
        const logDateKey = logDate.toISOString().split('T')[0];

        // If date filter is specified, only include logs from that date
        if (targetDate && logDateKey !== targetDate) return;

        const hour = logDate.getHours();

        if (log.activity === Activity.VetEduQuiz) {
          hourlyPattern[hour]!.vetEdu += 1;
        } else if (log.activity === Activity.SustainabilityQuiz) {
          hourlyPattern[hour]!.sustainability += 1;
        }
      });

      return formatApiResponse({
        vetEduParticipantsCount: vetEduParticipants.size,
        sustainabilityParticipantsCount: sustainabilityParticipants.size,
        activityTrend: trendData,
        hourlyPattern: hourlyPattern
      }, null);
    } catch (error) {
      return formatApiResponse<null>(null, error);
    }
  },

  /**
   * Subscribe to activity data changes
   */
  subscribe: (callback: (payload: RealtimeResponseEvent<AppwriteDocument<ActivityLog>>) => void) => {
    const channel = `databases.${DATABASE_ID}.tables.${ACTIVITY_LOG_TABLE_ID}.rows`;
    return client.subscribe(channel, callback);
  },
}

export const vetConsultationSchedule = {
  /**
   * Get all consultation schedule data
   */
  getAll: async (params?: {
    limit?: number;
    offset?: number;
    participantName?: string;
  }) => {
    try {
      const limit = params?.limit || 10;
      const offset = params?.offset || 0;

      const queries = [
        Query.limit(limit),
        Query.offset(offset),
        Query.orderDesc('$createdAt'),
        Query.select(['*', 'participants.*'])
      ];

      const response = await databases.listRows({
        databaseId: DATABASE_ID,
        tableId: VET_CONSULTATION_SHEDULE_TABLE_ID,
        queries: queries,
      });

      return formatApiResponse<AppwriteListResponse<VetConsultation>>({
        total: response.total,
        rows: response.rows as unknown as AppwriteDocument<VetConsultation>[]
      }, null);
    } catch (error) {
      return formatApiResponse<null>(null, error);
    }
  },

  getByParticipant: async (participantId: string) => {
    try {
      const response = await databases.listRows({
        databaseId: DATABASE_ID,
        tableId: VET_CONSULTATION_SHEDULE_TABLE_ID,
        queries: [Query.equal("participants", participantId)]
      });

      return formatApiResponse<AppwriteDocument<VetConsultation>>(
        response as unknown as AppwriteDocument<VetConsultation>,
        null
      );
    } catch (error) {
      return formatApiResponse<null>(null, error);
    }
  },

  /**
   * Get all consultation schedule for export (no pagination)
   */
  getAllForExport: async () => {
    try {
      const queries = [Query.orderDesc('$createdAt')];

      const response = await databases.listRows({
        databaseId: DATABASE_ID,
        tableId: VET_CONSULTATION_SHEDULE_TABLE_ID,
        queries: queries
      });

      return formatApiResponse<AppwriteListResponse<VetConsultation>>({
        total: response.total,
        rows: response.rows as unknown as AppwriteDocument<VetConsultation>[]
      }, null);
    } catch (error) {
      return formatApiResponse<null>(null, error);
    }
  },

  /**
   * Get vet consultation statistics
   * Returns total consultations and counts by pet type
   */
  getStats: async () => {
    try {
      const response = await databases.listRows({
        databaseId: DATABASE_ID,
        tableId: VET_CONSULTATION_SHEDULE_TABLE_ID,
        queries: [Query.orderAsc('$createdAt')]
      });

      const consultations = response.rows as unknown as AppwriteDocument<VetConsultation>[];
      const totalConsultations = response.total;

      // Count by pet type
      let dogCount = 0;
      let catCount = 0;

      consultations.forEach(consultation => {
        if (consultation.petType?.toLowerCase() === 'dog') {
          dogCount++;
        } else if (consultation.petType?.toLowerCase() === 'cat') {
          catCount++;
        }
      });

      return formatApiResponse({
        totalConsultations,
        dogCount,
        catCount
      }, null);
    } catch (error) {
      return formatApiResponse<null>(null, error);
    }
  },

  /**
   * Subscribe to vet consultaion schedule data changes
   */
  subscribe: (callback: (payload: RealtimeResponseEvent<AppwriteDocument<VetConsultation>>) => void) => {
    const channel = `databases.${DATABASE_ID}.tables.${VET_CONSULTATION_SHEDULE_TABLE_ID}.rows`;
    return client.subscribe(channel, callback);
  },

  /**
   * Create new vet consultation schedule
   */
  create: async (data: {
    participantId: string;
    petName: string;
    petType: string;
    petBreed: string;
  }) => {
    try {
      const response = await databases.createRow({
        databaseId: DATABASE_ID,
        tableId: VET_CONSULTATION_SHEDULE_TABLE_ID,
        rowId: ID.unique(),
        data: {
          participants: data.participantId,
          petName: data.petName,
          petType: data.petType,
          petBreed: data.petBreed
        }
      });

      return formatApiResponse<AppwriteDocument<VetConsultation>>(
        response as unknown as AppwriteDocument<VetConsultation>,
        null
      );
    } catch (error) {
      return formatApiResponse<null>(null, error);
    }
  },

  update: async () => {
    // TODO
  },

  delete: async () => {
    // TODO
  }
}