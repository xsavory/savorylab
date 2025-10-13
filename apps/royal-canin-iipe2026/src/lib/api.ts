import { ID, Query } from "appwrite";
import type { RealtimeResponseEvent } from "appwrite";

import { client, account, databases } from "src/lib/appwrite";
import { formatApiResponse } from "src/lib/utils";
import type { 
  AppwriteDocument, 
  AppwriteListResponse, 
  Participant, 
  Activity,
  ActivityLog 
} from "src/types/schema";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const PARTICIPANTS_TABLE_ID = import.meta.env.VITE_APPWRITE_PARTICIPANTS_TABLE_ID;
const ACTIVITY_LOG_TABLE_ID = import.meta.env.VITE_APPWRITE_ACTIVITY_LOG_TABLE_ID;

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
}