import apiClient from '../lib/api/apiClient';
import { API_ENDPOINTS } from '../lib/api/endpoints';
import { SupportTicket, ApiResponse } from '../types';

export interface TicketsResponse {
  tickets: SupportTicket[];
}

export class TicketService {
  static async getAllTickets(): Promise<TicketsResponse> {
    return await apiClient.get(API_ENDPOINTS.ADMIN.SUPPORT_TICKETS);
  }

  static async updateStatus(ticketId: string, status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'): Promise<ApiResponse<SupportTicket>> {
    return await apiClient.patch(API_ENDPOINTS.ADMIN.TICKET_STATUS(ticketId), { status });
  }
}
