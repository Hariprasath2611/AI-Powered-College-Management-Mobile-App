import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { storage } from '../utils/storage';
import { store } from '../redux/store';
import { logout, loginSuccess } from '../redux/slices/authSlice';
import { showToast } from '../redux/slices/uiSlice';

// API Base URL loaded from environment variables (fallback to localhost for emulator/simulator)
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:5000/api'; // 10.0.2.2 is Android Emulator host loopback

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _retryCount?: number;
}

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Attach bearer token
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await storage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle errors, retry, and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    if (!originalRequest) return Promise.reject(error);

    // Initialize retry count
    originalRequest._retryCount = originalRequest._retryCount || 0;
    const maxRetries = 3;

    // 1. Handle Network Errors & Timeouts (Retry Logic)
    const isNetworkError = !error.response;
    if (isNetworkError && originalRequest._retryCount < maxRetries) {
      originalRequest._retryCount++;
      console.warn(`Network error detected. Retrying request ${originalRequest.url} (${originalRequest._retryCount}/${maxRetries})...`);
      // Backoff delay: wait 1s, 2s, 3s
      await new Promise((resolve) => setTimeout(resolve, originalRequest._retryCount! * 1000));
      return api(originalRequest);
    }

    // 2. Handle 401 Unauthorized (Token Refresh Logic)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await storage.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call silent token refresh endpoint
        // Using a clean axios instance to avoid circular interceptor triggers
        const refreshResponse = await axios.post<{ token: string; refreshToken: string }>(
          `${API_URL}/auth/refresh`,
          { refreshToken }
        );

        const { token: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data;

        // Save new credentials
        await storage.setToken(newAccessToken);
        await storage.setRefreshToken(newRefreshToken);

        // Update Redux Store
        const currentUser = store.getState().auth.user;
        if (currentUser) {
          store.dispatch(
            loginSuccess({
              user: currentUser,
              token: newAccessToken,
              refreshToken: newRefreshToken,
            })
          );
        }

        // Retry the original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Silent token refresh failed, logging out user', refreshError);
        // Clear tokens and profile
        await storage.clearAuthData();
        store.dispatch(logout());
        store.dispatch(
          showToast({
            message: 'Session expired. Please log in again.',
            type: 'error',
          })
        );
        return Promise.reject(refreshError);
      }
    }

    // 3. Global Error Handling
    const errorMessage = (error.response?.data as any)?.message || 'An unexpected error occurred. Please try again.';
    
    // Log error details for development debugging
    console.error(`[API Error] URL: ${originalRequest.url} | Status: ${error.response?.status} | Message: ${errorMessage}`);

    return Promise.reject(new Error(errorMessage));
  }
);

export default api;
