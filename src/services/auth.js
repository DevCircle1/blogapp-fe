import { requireSupabaseConfig, supabase } from './supabase';

const success = (data, message) => ({ success: true, data, message });
const failure = (error, fallback) => ({ success: false, error, details: null, message: error?.message || fallback });
const getProfileData = (user) => user ? { id: user.id, email: user.email, ...user.user_metadata } : null;

export const signup = async ({ email, password }) => {
  try {
    requireSupabaseConfig();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/` },
    });
    if (error) throw error;
    return success(data, 'Account created. Check your email to verify it.');
  } catch (error) {
    return failure(error, 'Unable to create your account.');
  }
};

export const authService = {
  login: async ({ email, password }) => {
    try {
      requireSupabaseConfig();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return success({ session: data.session, user: getProfileData(data.user) }, 'Login successful');
    } catch (error) {
      return failure(error, 'Login failed.');
    }
  },

  refreshToken: async () => {
    try {
      requireSupabaseConfig();
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      return success(data, 'Session refreshed successfully');
    } catch (error) {
      return failure(error, 'Could not refresh the session.');
    }
  },

  logout: async () => {
    try {
      requireSupabaseConfig();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return success(null, 'Logout successful');
    } catch (error) {
      return failure(error, 'Logout failed.');
    }
  },

  getProfile: async () => {
    try {
      requireSupabaseConfig();
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return success(getProfileData(data.user), 'Profile fetched successfully');
    } catch (error) {
      return failure(error, 'Could not fetch the profile.');
    }
  },

  updateProfile: async (userData) => {
    try {
      requireSupabaseConfig();
      const { data, error } = await supabase.auth.updateUser({ data: userData });
      if (error) throw error;
      return success(getProfileData(data.user), 'Profile updated successfully');
    } catch (error) {
      return failure(error, 'Could not update the profile.');
    }
  },

  changePassword: async ({ password }) => {
    try {
      requireSupabaseConfig();
      const { data, error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      return success(data, 'Password changed successfully');
    } catch (error) {
      return failure(error, 'Could not change the password.');
    }
  },

  forgotPassword: async (email) => {
    try {
      requireSupabaseConfig();
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      if (error) throw error;
      return success(data, 'Password recovery link sent. Check your email.');
    } catch (error) {
      return failure(error, 'Could not send the recovery email.');
    }
  },

  resetPassword: async ({ password, confirm_password: confirmation }) => {
    if (password !== confirmation) return failure(new Error('Passwords do not match.'), 'Passwords do not match.');
    return authService.changePassword({ password });
  },
};

export const login = authService.login;
export default authService;
