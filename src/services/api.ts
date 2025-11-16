import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/utils/constants';
import { getToken, isTokenExpired, clearAuthData } from './auth';

/**
 * Axios instance configured for the KidSafe API
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

/**
 * Request interceptor to add authentication token
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();

    if (token) {
      if (isTokenExpired(token)) {
        clearAuthData();
        window.location.href = '/login/parent';
        return Promise.reject(new Error('Token expired'));
      }

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle errors
 */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      clearAuthData();
      window.location.href = '/login/parent';
    }

    return Promise.reject(error);
  }
);

export default api;
