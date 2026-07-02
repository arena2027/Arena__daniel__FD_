// ── Authentication Service ────────────────────────────────────────────────────
// Conditionally uses MockAuthService for development when backend unavailable

import type { AppUser } from '../../core/types';
import { API_ENDPOINTS, ROLE_PERMISSIONS } from '../../core/types';

// Import mock service for development
import { mockAuthService } from './MockAuthService';

// Environment flag to toggle between mock and real auth
const USE_MOCK_AUTH = import.meta.env.VITE_USE_REAL_AUTH !== 'true';

export class AuthService {
  private static instance: AuthService;
  private currentUser: AppUser | null = null;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(email: string, password: string): Promise<AppUser> {
    if (USE_MOCK_AUTH) {
      return mockAuthService.login(email, password);
    }

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const user = await response.json();
      this.currentUser = user;
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    if (USE_MOCK_AUTH) {
      return mockAuthService.logout();
    }

    try {
      await fetch(API_ENDPOINTS.AUTH.LOGOUT, { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.currentUser = null;
      localStorage.removeItem('user');
    }
  }

  async refreshToken(): Promise<AppUser | null> {
    if (USE_MOCK_AUTH) {
      return mockAuthService.refreshToken();
    }

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.REFRESH, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const user = await response.json();
      this.currentUser = user;
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.currentUser = null;
      localStorage.removeItem('user');
      return null;
    }
  }

  getCurrentUser(): AppUser | null {
    if (USE_MOCK_AUTH) {
      return mockAuthService.getCurrentUser();
    }

    if (this.currentUser) {
      return this.currentUser;
    }

    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        this.currentUser = JSON.parse(stored);
        return this.currentUser;
      } catch {
        localStorage.removeItem('user');
      }
    }

    return null;
  }

  isAuthenticated(): boolean {
    if (USE_MOCK_AUTH) {
      return mockAuthService.isAuthenticated();
    }

    return this.getCurrentUser() !== null;
  }

  hasPermission(permission: string): boolean {
    if (USE_MOCK_AUTH) {
      return mockAuthService.hasPermission(permission);
    }

    const user = this.getCurrentUser();
    if (!user) return false;

    return ROLE_PERMISSIONS[user.role].includes(permission);
  }

  hasRole(role: string): boolean {
    if (USE_MOCK_AUTH) {
      return mockAuthService.hasRole(role);
    }

    const user = this.getCurrentUser();
    return user?.role === role;
  }

  // Signup method for tipster registration
  async signup(
    email: string,
    password: string,
    name: string,
    role: 'user' | 'tipster' = 'user',
    termsAccepted = true,
    privacyAccepted = true,
    policyVersion = 'v1.0'
  ): Promise<AppUser> {
    if (USE_MOCK_AUTH) {
      return mockAuthService.signup(email, password, name, role, termsAccepted, privacyAccepted, policyVersion);
    }

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.SIGNUP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name,
          role,
          termsAccepted,
          privacyAccepted,
          acceptedAt: new Date().toISOString(),
          policyVersion,
        }),
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      const user = await response.json();
      this.currentUser = user;
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  // Request OTP for 2FA verification
  async requestOTP(email: string, password: string): Promise<{ requiresOtp: true; email: string }> {
    if (USE_MOCK_AUTH) {
      return mockAuthService.requestOTP(email, password);
    }

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, requestOtp: true }),
      });

      if (!response.ok) {
        throw new Error('OTP request failed');
      }

      return { requiresOtp: true, email };
    } catch (error) {
      console.error('OTP request error:', error);
      throw error;
    }
  }

  // resetPassword method removed; use mock service directly if needed
}

export const authService = AuthService.getInstance();