// src/services/auth.js
import { publicRequest, privateRequest, handleApiError } from './api';
export const signup = async (userData) => {
  try {
    const response = await publicRequest.post('/signup/', userData);
    return {
      success: true,
      data: response.data,
      message: 'Account created successfully',
    };
  } catch (error) {
    console.error('Signup error:', error);
    const errorInfo = handleApiError(error);
    return {
      success: false,
      error: errorInfo.details || errorInfo.message,
      details: error.response?.data || {},
      message: errorInfo.message,
    };
  }
};
// Authentication API calls
export const authService = {

  // Login user
  login: async (credentials) => {
    try {
      const response = await publicRequest.post('/login/', credentials);
      return {
        success: true,
        data: response.data,
        message: 'Login successful'
      };
    } catch (error) {
      console.error('Login error:', error);
      const errorInfo = handleApiError(error);
      return {
        success: false,
        error: errorInfo.details || errorInfo.message,
        message: errorInfo.message
      };
    }
  },

  // Refresh access token
  refreshToken: async (refreshToken) => {
    try {
      const response = await publicRequest.post('/auth/refresh/', {
        refresh: refreshToken
      });
      return {
        success: true,
        data: response.data,
        message: 'Token refreshed successfully'
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      const errorInfo = handleApiError(error);
      return {
        success: false,
        error: errorInfo.details || errorInfo.message,
        message: errorInfo.message
      };
    }
  },

  // Logout user (if you have a logout endpoint)
  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await privateRequest.post('/logout/', { refresh: refreshToken });
      }
      return {
        success: true,
        message: 'Logout successful'
      };
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, we still want to clear local storage
      return {
        success: true,
        message: 'Logged out (local only)'
      };
    }
  },

  // Get current user profile
  getProfile: async () => {
    try {
      const response = await privateRequest.get('/profile/');
      return {
        success: true,
        data: response.data,
        message: 'Profile fetched successfully'
      };
    } catch (error) {
      console.error('Get profile error:', error);
      const errorInfo = handleApiError(error);
      return {
        success: false,
        error: errorInfo.details || errorInfo.message,
        message: errorInfo.message
      };
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await privateRequest.put('/profile/', userData);
      return {
        success: true,
        data: response.data,
        message: 'Profile updated successfully'
      };
    } catch (error) {
      console.error('Update profile error:', error);
      const errorInfo = handleApiError(error);
      return {
        success: false,
        error: errorInfo.details || errorInfo.message,
        message: errorInfo.message
      };
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await privateRequest.post('/change-password/', passwordData);
      return {
        success: true,
        data: response.data,
        message: 'Password changed successfully'
      };
    } catch (error) {
      console.error('Change password error:', error);
      const errorInfo = handleApiError(error);
      return {
        success: false,
        error: errorInfo.details || errorInfo.message,
        message: errorInfo.message
      };
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      const res = await publicRequest.post(
        '/forgot-password/',
        { email },
        { headers: { 'Content-Type': 'application/json' } }
      );
      // expect backend shape like { success: true, message: "OTP sent" }
      const data = res?.data ?? {};
      return {
        success: Boolean(data.success),
        message: typeof data.message === 'string' ? data.message : 'OTP sent',
        raw: data,
      };
    } catch (error) {
      // keep one code path that always returns a string message
      const api = handleApiError?.(error);
      const msg = api?.details || api?.message || toErrorString(error?.response?.data);
      return { success: false, message: msg };
    }
  },
  // Reset password
  resetPassword: async (resetData) => {
  try {
    const email = localStorage.getItem('resetEmail');
    if (!email) {
      return {
        success: false,
        message: 'Reset email not found in local storage'
      };
    }

    const payload = {
      email,
      password: resetData.password,
      confirm_password: resetData.confirm_password
    };

    const response = await publicRequest.post('/update-password/', payload);

    return {
      success: true,
      data: response.data,
      message: 'Password reset successful'
    };
  } catch (error) {
    console.error('Reset password error:', error);
    const errorInfo = handleApiError(error);
    return {
      success: false,
      error: errorInfo.details || errorInfo.message,
      message: errorInfo.message
    };
  }
},

  // Verify email
  verifyEmail: async (email, otp) => {
    try {
      const response = await publicRequest.post('/verify-otp/', { email, otp });
      return {
        success: true,
        data: response.data,
        message: response.data?.message || 'Email verified successfully'
      };
    } catch (error) {
      console.error('Email verification error:', error);
      const errorInfo = handleApiError(error);
      return {
        success: false,
        error: errorInfo.details || errorInfo.message,
        message: errorInfo.message
      };
    }
  }
};

// Backward compatibility exports
export const login = authService.login;

export default authService;