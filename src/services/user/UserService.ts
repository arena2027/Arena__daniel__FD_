import { ApiClient } from '@/api/clients/ApiClient';
import type { AppUser } from '@/core/types';

export interface UpdateProfileRequest {
  name?: string;
  bio?: string;
  profilePicture?: string; // base64 or URL
}

class UserService {
  private static instance: UserService;
  private apiClient = ApiClient.getInstance();

  private constructor() {}

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async updateProfile(data: UpdateProfileRequest): Promise<AppUser> {
    return this.apiClient.put('/user/profile', data);
  }

  async uploadProfilePicture(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiClient.post('/user/profile-picture', formData);
  }

  async getProfile(): Promise<AppUser> {
    return this.apiClient.get('/user/profile');
  }

  async deleteProfilePicture(): Promise<void> {
    return this.apiClient.delete('/user/profile-picture');
  }
}

export const userService = UserService.getInstance();
