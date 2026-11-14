export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  status: 'ACTIVE' | 'BLOCKED';
  plan: 'FREE' | 'STARTER' | 'PRO';
  resumeCredits: number;
  atsCredits: number;
  profileImage?: string;
  createdAt: string;
}

export interface DashboardMetrics {
  totalUsers: number;
  totalActiveUsers: number;
  totalBlockedUsers: number;
  totalResumesGenerated: number;
  totalAtsChecksRun: number;
  totalJobsAppliedOverall: number;
  totalActiveTemplates: number;
  openSupportTickets: number;
}

export interface Template {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  layoutType: 'SINGLE_COLUMN' | 'TWO_COLUMN';
  thumbnailUrl?: string;
  isPremium: boolean;
  isActive: boolean;
  htmlContent?: string;
  cssStyles?: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    status: 'ACTIVE' | 'BLOCKED';
    plan: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  code?: string;
  data?: T;
}
