import apiClient from '../lib/api/apiClient';
import { API_ENDPOINTS } from '../lib/api/endpoints';
import { User, ApiResponse } from '../types';

export interface UsersResponse {
  success: boolean;
  users: User[];
}

export class UserService {
  static async getUsers(): Promise<UsersResponse> {
    return await apiClient.get(API_ENDPOINTS.ADMIN.USERS);
  }

  static async toggleBlock(userId: string): Promise<ApiResponse<{ id: string; email: string; status: 'ACTIVE' | 'BLOCKED' }>> {
    return await apiClient.patch(API_ENDPOINTS.ADMIN.USER_BLOCK(userId));
  }

  static async updateCredits(params: {
    userId: string;
    resumeCredits?: number;
    atsCredits?: number;
    plan?: string;
    role?: string;
  }): Promise<ApiResponse<User>> {
    return await apiClient.patch(API_ENDPOINTS.ADMIN.USER_CREDITS, params);
  }
}
