import axios from 'axios';
import { User } from '../types';

export interface LoginResponse {
  success: boolean;
  message?: string;
  user: User;
}

export class AuthService {
  /**
   * Admin Login via Next.js BFF (Stores JWT in httpOnly Secure cookie)
   */
  static async login(email: string, password: string): Promise<LoginResponse> {
    const res = await axios.post('/api/auth/login', { email, password });
    if (res.data?.success && res.data?.user && typeof window !== 'undefined') {
      localStorage.setItem('resumecraft_admin_user', JSON.stringify(res.data.user));
    }
    return res.data;
  }

  /**
   * Admin Logout via Next.js BFF (Wipes httpOnly cookies)
   */
  static async logout() {
    try {
      await axios.post('/api/auth/logout');
    } catch (e) {
      console.warn('Logout notice:', e);
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('resumecraft_admin_user');
      window.location.href = '/login';
    }
  }

  /**
   * Request password reset instructions via email
   */
  static async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    const res = await axios.post('/api/proxy/auth/forgot-password', { email });
    return res.data;
  }

  /**
   * Reset password via cryptographic web token or OTP
   */
  static async resetPassword(payload: {
    token?: string;
    email?: string;
    otpCode?: string;
    newPassword: string;
  }): Promise<{ success: boolean; message: string }> {
    const res = await axios.post('/api/proxy/auth/reset-password', payload);
    return res.data;
  }

  static getCurrentUser(): User | null {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('resumecraft_admin_user');
      return data ? JSON.parse(data) : null;
    }
    return null;
  }
}

