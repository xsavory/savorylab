// import { ID, Query, Role, Permission, Teams } from "appwrite";
import type { RealtimeResponseEvent } from "appwrite";

import { client, account, databases } from "src/lib/appwrite";
import { formatApiResponse } from "src/lib/utils";
// import type { Participant, Attendance, Admins } from "@/types/schema";

// const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
// const PARTICIPANTS_TABLE_ID = import.meta.env.VITE_APPWRITE_PARTICIPANTS_TABLE_ID;
// const ATTENDANCE_TABLE_ID = import.meta.env.VITE_APPWRITE_ATTENDANCE_TABLE_ID;
// const ADMINS_TABLE_ID = import.meta.env.VITE_APPWRITE_ADMINS_TABLE_ID;

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
  },

  /**
   * Create dummy session
   */
  createDummySession: async () => {
    try {
      await account.createEmailPasswordSession({ email: 'guest@test.com', password: 'password' });
    } catch (error) {
      console.error('Error creating dummy session:', error);
    }
  },
}

/**
 * Participants table operations
 */
export const participants = {
  /**
   * Get all participants with attendance status
   */
  getAll: async () => {
    
  },

  /**
   * Create new participant
   */
  create: async (participant: { name: string; }) => {
    
  },

  /**
   * Update participant
   */
  update: async (
    id: string,
    updates: { name?: string; isCheckedIn?: boolean },
  ) => {
    
  },

  /**
   * Delete participant
   */
  delete: async (id: string) => {
    
  },

  /**
   * Find participant by ID
   */
  findById: async (id: string) => {
    
  },

  /**
   * Get participant statistics
   */
  getStats: async () => {
    
  },
}

export const attendance = {
  /**
   * Get all attendance records
   */
  getAll: async () => {
    
  },

  /**
   * Record attendance for participant
   */
  create: async (participantId: string) => {
    // First, update participant check-in status

    // Then, create attendance record
  },
}

/**
 * Real-time subscription helpers
 */
export const subscribe = {
  /**
   * Subscribe to attendance changes for greetings display
   */
  subscribeToAttendance: (callback: (payload: any) => void) => {
    
  },

  /**
   * Subscribe to participant changes for real-time stats
   */
  subscribeToParticipants: (callback: (payload: any) => void) => {
    
  },
}