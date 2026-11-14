import apiClient from '../lib/api/apiClient';
import { API_ENDPOINTS } from '../lib/api/endpoints';
import { Template, ApiResponse } from '../types';

export interface TemplatesResponse {
  templates: Template[];
}

export class TemplateService {
  static async getAllTemplates(): Promise<TemplatesResponse> {
    return await apiClient.get(API_ENDPOINTS.ADMIN.TEMPLATES);
  }

  static async createTemplate(payload: {
    name: string;
    description: string;
    category?: string;
    layoutType?: 'SINGLE_COLUMN' | 'TWO_COLUMN';
    thumbnailUrl?: string;
    isPremium?: boolean;
    htmlContent?: string;
    cssStyles?: string;
  }): Promise<ApiResponse<Template>> {
    return await apiClient.post(API_ENDPOINTS.ADMIN.TEMPLATES, payload);
  }

  static async toggleStatus(templateId: string): Promise<ApiResponse<Template>> {
    return await apiClient.patch(API_ENDPOINTS.ADMIN.TEMPLATE_TOGGLE(templateId));
  }
}
