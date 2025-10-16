import { createContext, useState, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';

import { participants } from 'src/lib/api';
import { sleep } from 'src/lib/utils';
import type { Participant } from "src/types/schema";

export interface ParticipantAuthContextType {
  user: Participant | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  getUser: () => Promise<Participant>
  register: (name: string, phone: string) => Promise<{ success: boolean } | undefined>;
  logout: () => Promise<{ success: boolean } | undefined>;
}

const ParticipantAuthContext = createContext<ParticipantAuthContextType | undefined>(undefined);

export const ParticipantAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('participant')
    return stored ? JSON.parse(stored) : null
  })

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUser = useCallback(async () => {
    setIsLoading(true);
    
    try {
      await sleep(300)
      const stored = localStorage.getItem('participant')
      const data = stored ? JSON.parse(stored) : null

      if (data) {
        setUser(data)
        return data
      } else {
        setUser(null)
        return null
      }
    } catch (err) {
      console.info(err)
      setError('Failed get user data')
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, phone: string) => {
    setIsLoading(true);
    
    try {
      const response = await participants?.register({ name, phone })
      if (response?.success) {
        const data = { 
          id: response?.data?.$id,
          name, 
          phone
        }

        localStorage.setItem('participant', JSON.stringify(data))
        setUser(data)

        return { success: true }
      } else {
        setUser(null)
      }
    } catch (err) {
      setUser(null);
      setError(err instanceof Error ? err.message : 'Register failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);

    try {
      await sleep(500);
      localStorage.removeItem('participant');
      setUser(null);
      return { success: true };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, [])

  const contextValue: ParticipantAuthContextType = useMemo(() => ({
    user,
    isLoading,
    isError: !!error,
    error,
    getUser,
    register,
    logout
  }), [user, isLoading, error, register, getUser, logout]);

  return (
    <ParticipantAuthContext.Provider value={contextValue}>
      {children}
    </ParticipantAuthContext.Provider>
  );
};

export default ParticipantAuthContext;

