// ── Authentication Context ────────────────────────────────────────────────────

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AppUser } from '../../core/types';
import { authService } from '../../services/auth/AuthService';
import { tipsterService, type CreateTipsterRequest } from '../../services/tipster/TipsterService';

interface AuthContextType {
  user: AppUser | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role?: 'user' | 'tipster') => Promise<void>;
  requestOTP: (email: string, password: string) => Promise<{ requiresOtp: true; email: string }>;
  becomeTipster: (data: CreateTipsterRequest) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          // Try to refresh token
          const refreshedUser = await authService.refreshToken();
          setUser(refreshedUser);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const loggedInUser = await authService.login(email, password);
      setUser(loggedInUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, role: 'user' | 'tipster' = 'user') => {
    try {
      setLoading(true);
      setError(null);
      const newUser = await authService.signup(email, password, name, role);
      setUser(newUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const requestOTP = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await authService.requestOTP(email, password);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OTP request failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const becomeTipster = async (data: CreateTipsterRequest) => {
    try {
      setLoading(true);
      setError(null);
      await tipsterService.createTipsterProfile(data);
      // Update user role to tipster
      if (user) {
        const updatedUser = { ...user, role: 'tipster' as const };
        setUser(updatedUser);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to become tipster');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // (forgotPassword removed — previously added for reset flow)

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    requestOTP,
    becomeTipster,
    logout,
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
