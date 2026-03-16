import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await API.auth.verifyToken();
          if (response.valid) {import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await API.auth.verifyToken();
          if (response.valid) {
            setUser(response.user);
          } else {
            localStorage.removeItem('token');
            setToken(null);
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await API.auth.login(email, password);
      
      // Add role to user object based on email
      const userWithRole = {
        ...response.user,
        role: determineUserRole(email, response.user)
      };
      
      setUser(userWithRole);
      setToken(response.token);
      localStorage.setItem('token', response.token);
      return { success: true, user: userWithRole };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Helper function to determine user role
  const determineUserRole = (email, userData) => {
    // Admin emails - you can customize this list
    const adminEmails = [
      'admin@abiaway.gov.ng',
      'admin@abiaone.gov.ng',
      'chidi.okonkwo@abiaway.gov.ng',
      'director@abiaway.gov.ng'
    ];
    
    // Driver emails - you can customize this list
    const driverEmails = [
      'driver@abiaway.gov.ng',
      'chidi.okonkwo@abiaway.gov.ng', // Example driver
      'emeka.okafor@abiaway.gov.ng',
      'ngozi.eze@abiaway.gov.ng'
    ];

    if (adminEmails.includes(email.toLowerCase())) {
      return 'admin';
    } else if (driverEmails.includes(email.toLowerCase())) {
      return 'driver';
    } else {
      return 'passenger'; // Regular user/passenger
    }
  };

  // For demo purposes, add a simple demo login
  const demoLogin = async (role = 'passenger') => {
    const demoUsers = {
      admin: {
        email: 'admin@abiaway.gov.ng',
        name: 'Admin User',
        role: 'admin'
      },
      driver: {
        email: 'chidi.okonkwo@abiaway.gov.ng',
        name: 'Chidi Okonkwo',
        role: 'driver'
      },
      passenger: {
        email: 'passenger@example.com',
        name: 'Abuoma David',
        role: 'passenger'
      }
    };

    const demoUser = demoUsers[role];
    setUser({
      ...demoUser,
      id: Date.now()
    });
    setToken('demo-token-12345');
    localStorage.setItem('token', 'demo-token-12345');
    return { success: true, user: demoUser };
  };

  const logout = async () => {
    try {
      await API.auth.logout();
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  // Check if user is driver
  const isDriver = () => {
    return user?.role === 'driver';
  };

  const value = {
    user,
    token,
    loading,
    login,
    demoLogin, // Added for easy testing
    logout,
    isAuthenticated: !!user,
    hasRole,
    isAdmin,
    isDriver
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
            setUser(response.user);
          } else {
            localStorage.removeItem('token');
            setToken(null);
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await API.auth.login(email, password);
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('token', response.token);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await API.auth.logout();
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};