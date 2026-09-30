import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Rehydrate auth state on initial mount & page refresh
  useEffect(() => {
    const verifyAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          // Validate token and get fresh profile details from backend
          const res = await api.get('/auth/profile');
          if (res.data && res.data.user) {
            setUser(res.data.user);
            setToken(storedToken);
            localStorage.setItem('user', JSON.stringify(res.data.user));
          }
        } catch (error) {
          console.error('Session verification failed:', error.response?.data?.message || error.message);
          // Token is expired or invalid
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    verifyAuth();
  }, []);

  // Register student
  const register = async (name, email, password, confirmPassword) => {
    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        password,
        confirmPassword
      });

      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true, message: res.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, message };
    }
  };

  // Login student
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });

      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true, message: res.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid email or password.';
      return { success: false, message };
    }
  };

  // Update profile
  const updateProfile = async (name, email) => {
    try {
      const res = await api.put('/auth/profile', { name, email });
      if (res.data && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        return { success: true, message: res.data.message || 'Profile updated successfully' };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile.';
      return { success: false, message };
    }
  };

  // Logout student
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    register,
    login,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
