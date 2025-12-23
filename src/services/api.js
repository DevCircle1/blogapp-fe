import axios from 'axios';
const API_BASE_URL = import.meta.env.REACT_APP_API_URL || 'https://api.talkandtool.com/api';
export const publicRequest = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
export const privateRequest = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
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
privateRequest.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await publicRequest.post('/auth/refresh/', {
            refresh: refreshToken
          });

          const { access } = response.data;
          localStorage.setItem('accessToken', access);
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return privateRequest(originalRequest);
          
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userData');
          window.location.href = '/login';
        }
      } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userData');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);
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

export const handleApiError = (error) => {
  if (error.response) {
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