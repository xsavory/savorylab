import { Query } from "appwrite";
import type { RealtimeResponseEvent } from "appwrite";

import { client, account, databases } from "src/lib/appwrite";
import { formatApiResponse, createTypedListResponse } from "src/lib/utils";
import type { Book } from "src/types/schema";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const BOOKS_TABLE_ID = import.meta.env.VITE_APPWRITE_BOOKS_TABLE_ID;

// React Query keys
export const QUERY_KEYS = {
  auth: ['auth', 'user'],
  books: ['books']
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
}

/**
 * Books collection operations
 */
export const books = {
  /**
   * Get all books
   */
  getAll: async () => {
    try {
      const response = await databases.listRows({
          databaseId: DATABASE_ID,
          tableId: BOOKS_TABLE_ID,
          queries: [Query.orderDesc('$createdAt')]
      });

      const typedResponse = createTypedListResponse<Book>(response);
      return formatApiResponse(typedResponse, null);
    } catch (error) {
      return formatApiResponse<null>(null, error);
    }
  },
}