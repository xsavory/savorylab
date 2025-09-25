import { createContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';

import { auth } from 'src/lib/api';
import type { User } from "src/types/schema";

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<{ success: boolean; error?: string }>;
  refetch: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Prevent multiple concurrent auth checks
  const isCheckingAuth = useRef(false);
  const hasInitialized = useRef(false);

  // Check authentication status
  const checkAuth = async () => {
    // Prevent multiple concurrent calls
    if (isCheckingAuth.current) {
      return;
    }

    try {
      isCheckingAuth.current = true;
      setIsLoading(true);
      setError(null);

      const response = await auth.getUser();
      if (response.success && response.data?.user) {
        const userData = response.data.user;
        const mappedUser: User = {
          id: userData.$id,
          name: userData.name,
          email: userData.email,
          createdAt: new Date(userData.$createdAt),
          updatedAt: new Date(userData.$updatedAt),
        };
        setUser(mappedUser);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
      isCheckingAuth.current = false;
      hasInitialized.current = true;
    }
  };

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await auth.signIn(email, password);
      if (!response.success) {
        throw new Error(response.error || 'Sign in failed');
      }

      // Re-check auth state after successful login
      await checkAuth();
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await auth.signOut();
      if (!response.success) {
        throw new Error(response.error || 'Sign out failed');
      }

      // Only clear user state - let router handle navigation
      setUser(null);

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed';
      setError(errorMessage);
      console.error('❌ Logout error:', err);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize auth state & setup realtime listeners
  useEffect(() => {
    // Prevent double initialization in StrictMode
    if (hasInitialized.current) {
      return;
    }

    checkAuth();

    // Setup Appwrite realtime subscription for session changes
    try {
      const unsubscribe = auth.onAuthStateChange((response) => {

        // Handle session deletion (logout from other device/tab)
        if (response.events?.includes('users.*.sessions.*.delete')) {
          setUser(null);
          setError(null);
        }

        // Handle new session creation
        if (response.events?.includes('users.*.sessions.*.create')) {
          checkAuth(); // Refresh user data
        }
      });

      return () => {
        hasInitialized.current = false; // Reset for cleanup
        unsubscribe();
      };
    } catch (error) {
      console.error('❌ Failed to setup Appwrite realtime listener:', error);
    }
  }, []);

  const contextValue: AuthContextType = useMemo(() => ({
    user,
    isLoading,
    isError: !!error,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    refetch: checkAuth,
  }), [user, isLoading, error, login, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

