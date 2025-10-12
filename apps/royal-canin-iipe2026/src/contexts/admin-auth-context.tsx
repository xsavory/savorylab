import { createContext, useState, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';

import { adminAuth } from 'src/lib/api';
import type { Admin } from "src/types/schema";

export interface AdminAuthContextType {
  user: Admin | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  getUser: () => Promise<Admin | null>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<{ success: boolean; error?: string }>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getUser = async () => {
    setIsLoading(true);

    try {
      const response = await adminAuth.getUser();
      if (response.success && response.data?.user) {
        const userData = response.data.user;
        const mappedUser: Admin = {
          id: userData.$id,
          name: userData.name,
          email: userData.email,
          createdAt: new Date(userData.$createdAt),
          updatedAt: new Date(userData.$updatedAt),
        };
        setUser(mappedUser);
        return mappedUser;
      } else {
        setUser(null)
        return null
      }
    } catch (err) {
      setUser(null)
      setError(err instanceof Error ? err.message : 'Authentication failed');
      return null
    } finally {
      setIsLoading(false)
    }
  };

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await adminAuth.signIn(email, password);
      if (!response.success) {
        throw new Error(response.error || 'Sign in failed');
      }

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

      const response = await adminAuth.signOut();
      if (!response.success) {
        throw new Error(response.error || 'Sign out failed');
      }

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

  const contextValue: AdminAuthContextType = useMemo(() => ({
    user,
    isLoading,
    isError: !!error,
    error,
    getUser,
    login,
    logout,
  }), [user, isLoading, error, login, logout]);

  return (
    <AdminAuthContext.Provider value={contextValue}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthContext;

