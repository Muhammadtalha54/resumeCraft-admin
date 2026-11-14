import apiClient from '../lib/api/apiClient';
import { API_ENDPOINTS } from '../lib/api/endpoints';
import { DashboardMetrics, User } from '../types';

export interface DashboardDataResponse {
  success: boolean;
  metrics: DashboardMetrics;
  recentUsers: User[];
  recentResumes: any[];
}

export class DashboardService {
  static async getMetrics(): Promise<DashboardDataResponse> {
    return await apiClient.get(API_ENDPOINTS.ADMIN.DASHBOARD);
  }
}
