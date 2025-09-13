// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import { privateRequest } from '../services/api'; 

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('userData');

        if (!token) {
          setIsAuthenticated(false);
          return;
        }

        // If we already have userData, trust it and finish
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
          return;
        }

        // No userData, try to fetch profile using the token
        try {
          const { data } = await privateRequest.get('/profile/');
          localStorage.setItem('userData', JSON.stringify(data));
          setUser(data);
          setIsAuthenticated(true);
        } catch (e) {
          // token may be invalid or request failed
          console.error('Error fetching profile on init:', e);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userData');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const loginUser = async (tokens, maybeUserData = null) => {
    try {
      // store tokens first
      localStorage.setItem('accessToken', tokens.access);
      if (tokens.refresh) {
        localStorage.setItem('refreshToken', tokens.refresh);
      }

      // if we already got user from login API, save it
      if (maybeUserData) {
        localStorage.setItem('userData', JSON.stringify(maybeUserData));
        setUser(maybeUserData);
        setIsAuthenticated(true);
        return;
      }

      // otherwise fetch it
      const profileResponse = await privateRequest.get('/profile/');
      const userData = profileResponse.data;
      localStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error logging in user:', error);
      // clean up on failure
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logoutUser = () => {
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
      setUser(null);
      setIsAuthenticated(false);
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error logging out user:', error);
    }
  };

  const updateUser = (userData) => {
    try {
      localStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const getToken = () => localStorage.getItem('accessToken');
  const getRefreshToken = () => localStorage.getItem('refreshToken');

  const value = {
    user,
    loading,
    isAuthenticated,
    loginUser,
    logoutUser,
    updateUser,
    getToken,
    getRefreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
