import axios, { AxiosError } from 'axios';

// The client now communicates strictly through the Next.js BFF proxy
export const apiClient = axios.create({
  baseURL: '/api/proxy',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Automatically sends httpOnly cookies to Next.js BFF
});

// ==================== RESPONSE INTERCEPTOR ====================
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error: AxiosError<any>) => {
    let message = 'An unexpected server error occurred. Please try again.';

    if (error.response?.data) {
      const data = error.response.data;
      if (data.message) {
        message = data.message;
      } else if (data.error) {
        message = data.error;
      }

      if (data.code === 'USER_BLOCKED' || data.isBlocked) {
        message = 'Your account has been blocked by the Administrator.';
      }

      if (error.response.status === 401 && typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } else if (error.request) {
      message = 'Unable to connect to the backend server. Please check your network connection.';
    }

    return Promise.reject(new Error(message));
  }
);

export default apiClient;
