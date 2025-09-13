// src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// ✅ Create a public axios instance (no auth required)
export const publicRequest = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Create a private axios instance (requires auth)
export const privateRequest = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for private requests - automatically attach token
privateRequest.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for private requests - handle token refresh
privateRequest.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired (401) and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          // Try to refresh the token
          const response = await publicRequest.post('/auth/refresh/', {
            refresh: refreshToken
          });

          const { access } = response.data;
          localStorage.setItem('accessToken', access);
          

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return privateRequest(originalRequest);
          
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          
          // Refresh failed, clear tokens and redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userData');
          
          // You might want to trigger a logout action here
          // or redirect to login page
          window.location.href = '/login';
        }
      } else {
        // No refresh token, clear storage and redirect
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userData');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Response interceptor for public requests - handle general errors
publicRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
    } else if (!error.response) {
      console.error('Network error - server might be down');
    }
    return Promise.reject(error);
  }
);

// Utility functions
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return {
          message: 'Invalid request. Please check your input.',
          details: data
        };
      case 401:
        return {
          message: 'Authentication required. Please log in.',
          details: data
        };
      case 403:
        return {
          message: 'Access denied. You don\'t have permission.',
          details: data
        };
      case 404:
        return {
          message: 'Resource not found.',
          details: data
        };
      case 422:
        return {
          message: 'Validation error. Please check your input.',
          details: data
        };
      case 500:
        return {
          message: 'Server error. Please try again later.',
          details: data
        };
      default:
        return {
          message: `Error ${status}: ${data?.message || 'Something went wrong'}`,
          details: data
        };
    }
  } else if (error.request) {
    // Network error
    return {
      message: 'Network error. Please check your connection.',
      details: null
    };
  } else {
    // Other error
    return {
      message: error.message || 'Something went wrong',
      details: null
    };
  }
};

export default {
  publicRequest,
  privateRequest,
  handleApiError,
};