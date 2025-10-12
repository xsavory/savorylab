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
  activityLog: ['activity', 'log']
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
   */
  getLeaderboards: async () => {
    try {
      const queries = [
        Query.limit(3),
        Query.orderDesc('points')
      ];

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
   * Submit participant quiz result
   */
  submitQuizResult: async (data: {
    participantId: string;
    activity: Activity;
    points: number
  }) => {
    try {
      await databases.updateRow({
        databaseId: DATABASE_ID,
        tableId: PARTICIPANTS_TABLE_ID,
        rowId: data.participantId,
        data: {
          points: data.points
        }
      })

      const response = await databases.createRow({
        databaseId: DATABASE_ID,
        tableId: ACTIVITY_LOG_TABLE_ID,
        rowId: ID.unique(),
        data: {
          participant: data.participantId,
          activity: data.activity,
        }
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
        queries: [Query.equal("participant", participantId)]
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
   * Create new participant activity
   */
  create: async (participantActivity: {
    participantId: string;
    activity?: Activity;
  }) => {
    try {
      const response = await databases.createRow({
        databaseId: DATABASE_ID,
        tableId: ACTIVITY_LOG_TABLE_ID,
        rowId: ID.unique(),
        data: {
          participant: participantActivity.participantId,
          activity: participantActivity.activity
        }
      });

      return formatApiResponse<AppwriteDocument<ActivityLog>>(
        response as unknown as AppwriteDocument<ActivityLog>,
        null
      );
    } catch (error) {
      return formatApiResponse<null>(null, error);
    }
  },
}