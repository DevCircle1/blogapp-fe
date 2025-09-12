// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on app start
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem('accessToken');
        const userData = localStorage.getItem('userData');
        
        if (token && userData) {
          setUser(JSON.parse(userData));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear invalid data
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userData');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const loginUser = (tokens, userData) => {
    try {
      // Store tokens
      localStorage.setItem('accessToken', tokens.access);
      if (tokens.refresh) {
        localStorage.setItem('refreshToken', tokens.refresh);
      }
      
      // Store user data
      if (userData) {
        localStorage.setItem('userData', JSON.stringify(userData));
        setUser(userData);
      }
      
      setIsAuthenticated(true);
      console.log('User logged in successfully');
    } catch (error) {
      console.error('Error logging in user:', error);
    }
  };

  const logoutUser = () => {
    try {
      // Clear all stored data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
      
      // Reset state
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

  const getToken = () => {
    return localStorage.getItem('accessToken');
  };

  const getRefreshToken = () => {
    return localStorage.getItem('refreshToken');
  };

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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}