import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const API_BASE_URL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // Check for user in local storage
    const storedUser = localStorage.getItem('blog_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('blog_user');
      }
    }
    
    // Check for theme in local storage
    const storedTheme = localStorage.getItem('blog_theme') || 'dark';
    setTheme(storedTheme);
    document.body.className = storedTheme === 'light' ? 'light-theme' : '';
    
    setLoading(false);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('blog_theme', nextTheme);
    document.body.className = nextTheme === 'light' ? 'light-theme' : '';
  };

  const login = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    setUser(data);
    localStorage.setItem('blog_user', JSON.stringify(data));
    return data;
  };

  const register = async (username, email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    setUser(data);
    localStorage.setItem('blog_user', JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('blog_user');
  };

  // Auth fetch helper to auto-inject Bearer tokens
  const authFetch = async (url, options = {}) => {
    const headers = { ...options.headers };
    if (user && user.token) {
      headers['Authorization'] = `Bearer ${user.token}`;
    }
    
    if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    return response;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        theme,
        toggleTheme,
        login,
        register,
        logout,
        authFetch,
        apiBaseUrl: API_BASE_URL,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
