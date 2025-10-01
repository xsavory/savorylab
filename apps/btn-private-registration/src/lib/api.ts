import { ID, Query } from "appwrite";
import type { RealtimeResponseEvent } from "appwrite";

import { client, account, databases } from "src/lib/appwrite";
import { formatApiResponse } from "src/lib/utils";
import type { Participant, Attendance, AppwriteDocument, AppwriteListResponse } from "src/types/schema";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const PARTICIPANTS_TABLE_ID = import.meta.env.VITE_APPWRITE_PARTICIPANTS_TABLE_ID;
const ATTENDANCE_TABLE_ID = import.meta.env.VITE_APPWRITE_ATTENDANCE_TABLE_ID;

// React Query keys
export const QUERY_KEYS = {
  auth: ['auth', 'user'],
  participants: ['participants'],
  attendance: ['attendance'],
  stats: ['stats'],
};

/**
 * Admin authentication API
 */
export const auth = {
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
  }
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
    isCheckedIn?: boolean;
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
        // Use contains for case-insensitive partial matching
        // Note: requires name attribute to be indexed in Appwrite
        queries.push(Query.contains('name', params.searchName));
      }

      if (params?.isCheckedIn !== undefined) {
        queries.push(Query.equal('isCheckedIn', params.isCheckedIn));
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
   * Get participant data by id
   */
  getById: async (id: string) => {
    try {
      const response = await databases.getRow({
        databaseId: DATABASE_ID,
        tableId: PARTICIPANTS_TABLE_ID,
        rowId: id
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
   * Create new participant
   */
  create: async (participant: {
    name: string;
    email?: string;
    phone?: string;
  }) => {
    try {
      const response = await databases.createRow({
        databaseId: DATABASE_ID,
        tableId: PARTICIPANTS_TABLE_ID,
        rowId: ID.unique(),
        data: {
          name: participant.name,
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
   * Update participant
   */
  update: async (
    id: string,
    updates: {
      name?: string;
      isCheckedIn?: boolean;
    },
  ) => {
    try {
      const response = await databases.updateRow({
        databaseId: DATABASE_ID,
        tableId: PARTICIPANTS_TABLE_ID,
        rowId: id,
        data: updates
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
   * Delete participant
   */
  delete: async (id: string) => {
    try {
      await databases.deleteRow({
        databaseId: DATABASE_ID,
        tableId: PARTICIPANTS_TABLE_ID,
        rowId: id
      });

      return formatApiResponse(true, null);
    } catch (error) {
      return formatApiResponse<null>(null, error);
    }
  },

  /**
   * Get participant statistics
   */
  getStats: async () => {
    try {
      // Get total participants count (limit to 0 to only get count, not data)
      const totalResponse = await databases.listRows({
        databaseId: DATABASE_ID,
        tableId: PARTICIPANTS_TABLE_ID,
        queries: [Query.limit(1)]
      });

      // Get checked in participants count (limit to 0 to only get count, not data)
      const checkedInResponse = await databases.listRows({
        databaseId: DATABASE_ID,
        tableId: PARTICIPANTS_TABLE_ID,
        queries: [Query.equal('isCheckedIn', true)]
      });

      const total = totalResponse.total;
      const checkedIn = checkedInResponse.total;
      const notCheckedIn = total - checkedIn;

      return formatApiResponse({
        total,
        checkedIn,
        notCheckedIn,
      }, null);
    } catch (error) {
      return formatApiResponse<null>(null, error);
    }
  },
}

export const attendance = {
  /**
   * Record attendance for participant
   */
  create: async (participantId: string) => {
    try {
      // Check if participant exists
      const participantResponse = await databases.getRow({
        databaseId: DATABASE_ID,
        tableId: PARTICIPANTS_TABLE_ID,
        rowId: participantId
      });

      const participant = participantResponse as unknown as AppwriteDocument<Participant>;

      // Validate participant data exists
      if (!participant) {
        return formatApiResponse<null>(null, new Error('Participant tidak ditemukan'));
      }

      // Check if already checked in
      if (participant.isCheckedIn) {
        return formatApiResponse<null>(null, new Error('Participant sudah check-in'));
      }

      // Update participant check-in status
      await databases.updateRow({
        databaseId: DATABASE_ID,
        tableId: PARTICIPANTS_TABLE_ID,
        rowId: participantId,
        data: { 
          isCheckedIn: true,
          checkedInAt: new Date().toISOString(),
        }
      });

      // Create attendance record
      const attendanceResponse = await databases.createRow({
        databaseId: DATABASE_ID,
        tableId: ATTENDANCE_TABLE_ID,
        rowId: ID.unique(),
        data: {
          participantId: participantId,
          checkedInAt: new Date().toISOString(),
        }
      });

      return formatApiResponse<AppwriteDocument<Attendance>>(
        attendanceResponse as unknown as AppwriteDocument<Attendance>,
        null
      );
    } catch (error) {
      return formatApiResponse<null>(null, error);
    }
  },

  /**
   * Subscribe to attendance changes for greetings display
   */
  subscribe: (callback: (payload: RealtimeResponseEvent<AppwriteDocument<Attendance>>) => void) => {
    const channel = `databases.${DATABASE_ID}.tables.${ATTENDANCE_TABLE_ID}.rows`;
    return client.subscribe(channel, callback);
  },
}