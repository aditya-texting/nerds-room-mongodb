import axios from 'axios';
import { ENV } from './env';

const isServer = typeof window === 'undefined';

// Client-side requests should use relative paths (/) to avoid exposing the full API URL.
// Server-side requests can use the full ENV.API_URL
const baseURL = isServer ? ENV.API_URL : '/api';

export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For passing cookies
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Modify config before request is sent (e.g., attach tokens if needed)
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Return full response so services can do response.data correctly
    return response;
  },
  (error) => {
    // Handle global errors like 401 Unauthorized
    if (error.response?.status === 401) {
      // e.g. redirect to login or show toast
    }
    return Promise.reject(error);
  }
);
