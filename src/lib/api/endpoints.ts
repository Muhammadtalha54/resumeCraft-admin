/**
 * Central API Endpoint Route Constants
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH_TOKEN: '/auth/refresh-token',
    PROFILE: '/auth/profile',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    USER_BLOCK: (id: string) => `/admin/users/${id}/block`,
    USER_CREDITS: '/admin/users/credits',
    TEMPLATES: '/admin/templates',
    TEMPLATE_TOGGLE: (id: string) => `/admin/templates/${id}/toggle`,
    SUPPORT_TICKETS: '/admin/support/tickets',
    TICKET_STATUS: (id: string) => `/admin/support/tickets/${id}/status`,
  },
  PUBLIC: {
    TEMPLATES: '/templates',
    JOBS_SEARCH: '/jobs/search',
    JOBS_APPLY: '/jobs/apply',
  }
} as const;
