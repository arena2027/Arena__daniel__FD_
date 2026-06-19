// ── Tipster Service ──────────────────────────────────────────────────────
// Handles all tipster profile operations

import { apiClient } from '../../api/clients/ApiClient';
import type { TipsterProfileModel } from '../../database/models/TipsterProfile';

export interface CreateTipsterRequest {
  bio: string;
  experience: string;
  channelName: string;
  specialties: string[];
  price?: number;
}

export interface TipsterProfile extends TipsterProfileModel {
  id: string;
}

class TipsterServiceClass {
  /**
   * Create a new tipster profile for the current user
   */
  async createTipsterProfile(data: CreateTipsterRequest): Promise<TipsterProfile> {
    try {
      const response = await apiClient.post<{ data: TipsterProfile }>(
        '/tipster/create',
        {
          bio: data.bio,
          experience: data.experience,
          channelName: data.channelName,
          specialties: data.specialties,
          price: data.price,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to create tipster profile:', error);
      throw error;
    }
  }

  /**
   * Get current user's tipster profile
   */
  async getTipsterProfile(): Promise<TipsterProfile | null> {
    try {
      const response = await apiClient.get<{ data: TipsterProfile | null }>(
        '/tipster/profile'
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch tipster profile:', error);
      return null;
    }
  }

  /**
   * Update tipster profile
   */
  async updateTipsterProfile(data: Partial<CreateTipsterRequest>): Promise<TipsterProfile> {
    try {
      const response = await apiClient.put<{ data: TipsterProfile }>(
        '/tipster/profile',
        data
      );
      return response.data;
    } catch (error) {
      console.error('Failed to update tipster profile:', error);
      throw error;
    }
  }

  /**
   * Get tipster by user ID
   */
  async getTipsterByUserId(userId: string): Promise<TipsterProfile | null> {
    try {
      const response = await apiClient.get<{ data: TipsterProfile | null }>(
        `/tipster/user/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch tipster by user ID:', error);
      return null;
    }
  }

  /**
   * Search tipsters by name or specialty
   */
  async searchTipsters(query: string): Promise<TipsterProfile[]> {
    try {
      const response = await apiClient.get<{ data: TipsterProfile[] }>(
        `/tipster/search?q=${encodeURIComponent(query)}`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to search tipsters:', error);
      return [];
    }
  }

  /**
   * Get top tipsters by win rate
   */
  async getTopTipsters(limit: number = 10): Promise<TipsterProfile[]> {
    try {
      const response = await apiClient.get<{ data: TipsterProfile[] }>(
        `/tipster/top?limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch top tipsters:', error);
      return [];
    }
  }

  /**
   * Follow a tipster
   */
  async followTipster(tipsterId: string): Promise<void> {
    try {
      await apiClient.post(`/tipster/${tipsterId}/follow`);
    } catch (error) {
      console.error('Failed to follow tipster:', error);
      throw error;
    }
  }

  /**
   * Unfollow a tipster
   */
  async unfollowTipster(tipsterId: string): Promise<void> {
    try {
      await apiClient.post(`/tipster/${tipsterId}/unfollow`);
    } catch (error) {
      console.error('Failed to unfollow tipster:', error);
      throw error;
    }
  }
}

export const tipsterService = new TipsterServiceClass();
