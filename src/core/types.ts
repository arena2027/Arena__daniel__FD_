// ── Core Types & Constants ─────────────────────────────────────────────────────

export type UserRole = 'user' | 'tipster' | 'admin';

export interface AppUser {
  id: string;
  name: string;
  handle: string;
  email: string;
  role: UserRole;
  subscriptionStatus?: 'free' | 'premium';
  createdAt: string;
}

export interface TipsterProfile {
  userId: string;
  bio: string;
  winRate: number;
  followers: number;
  premiumPrice?: number;
  verifiedStatus: boolean;
  streak: number;
}

export interface Permission {
  name: string;
  description: string;
}

export const PERMISSIONS: Record<string, Permission> = {
  // Shared
  VIEW_PROFILE: { name: 'view_profile', description: 'View user profiles' },
  EDIT_PROFILE: { name: 'edit_profile', description: 'Edit own profile' },
  VIEW_NOTIFICATIONS: { name: 'view_notifications', description: 'View notifications' },
  SEND_MESSAGES: { name: 'send_messages', description: 'Send messages' },

  // User
  VIEW_PREDICTIONS: { name: 'view_predictions', description: 'View predictions' },
  FOLLOW_TIPSTERS: { name: 'follow_tipsters', description: 'Follow tipsters' },
  PLACE_BETS: { name: 'place_bets', description: 'Place bets' },

  // Tipster
  CREATE_PREDICTIONS: { name: 'create_predictions', description: 'Create predictions' },
  MANAGE_SUBSCRIBERS: { name: 'manage_subscribers', description: 'Manage subscribers' },
  VIEW_ANALYTICS: { name: 'view_analytics', description: 'View analytics' },
  ACCESS_PREMIUM_TOOLS: { name: 'access_premium_tools', description: 'Access premium tools' },

  // Admin
  MANAGE_USERS: { name: 'manage_users', description: 'Manage users' },
  VERIFY_TIPSTERS: { name: 'verify_tipsters', description: 'Verify tipsters' },
  SYSTEM_ADMIN: { name: 'system_admin', description: 'System administration' },
};

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  user: [
    'view_profile',
    'edit_profile',
    'view_notifications',
    'send_messages',
    'view_predictions',
    'follow_tipsters',
    'place_bets',
  ],
  tipster: [
    'view_profile',
    'edit_profile',
    'view_notifications',
    'send_messages',
    'view_predictions',
    'follow_tipsters',
    'place_bets',
    'create_predictions',
    'manage_subscribers',
    'view_analytics',
    'access_premium_tools',
  ],
  admin: [
    'view_profile',
    'edit_profile',
    'view_notifications',
    'send_messages',
    'view_predictions',
    'follow_tipsters',
    'place_bets',
    'create_predictions',
    'manage_subscribers',
    'view_analytics',
    'access_premium_tools',
    'manage_users',
    'verify_tipsters',
    'system_admin',
  ],
};

export const ROUTE_ACCESS: Record<UserRole, string[]> = {
  user: ['/', '/explore', '/live', '/predictions', '/communities', '/messages', '/notifications', '/bookmarks', '/wallet', '/settings', '/profile', '/user/*'],
  tipster: ['/', '/explore', '/live', '/predictions', '/communities', '/messages', '/notifications', '/bookmarks', '/wallet', '/settings', '/profile', '/dashboard', '/user/*'],
  admin: ['/', '/explore', '/live', '/predictions', '/communities', '/messages', '/notifications', '/bookmarks', '/wallet', '/settings', '/profile', '/dashboard', '/admin', '/user/*'],
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    PROFILE: '/api/auth/profile',
  },
  USERS: {
    PROFILE: '/api/users/profile',
    UPDATE: '/api/users/update',
  },
  TIPSTERS: {
    PROFILE: '/api/tipsters/profile',
    PREDICTIONS: '/api/tipsters/predictions',
    ANALYTICS: '/api/tipsters/analytics',
  },
  PREDICTIONS: {
    LIST: '/api/predictions',
    CREATE: '/api/predictions',
  },
} as const;