import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

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

  // Helper function to determine user role
  const determineUserRole = (email) => {
    const adminEmails = [
      'admin@abiaway.gov.ng',
      'admin@abiaone.gov.ng',
      'director@abiaway.gov.ng'
    ];
    
    const driverEmails = [
      'driver@abiaway.gov.ng',
      'chidi.okonkwo@abiaway.gov.ng',
      'emeka.okafor@abiaway.gov.ng',
      'ngozi.eze@abiaway.gov.ng'
    ];

    if (adminEmails.includes(email.toLowerCase())) {
      return 'admin';
    } else if (driverEmails.includes(email.toLowerCase())) {
      return 'driver';
    } else {
      return 'passenger';
    }
  };

  const login = async (email, password, userData = null) => {
    try {
      let response;
      
      if (userData) {
        // Direct login with user data (from demo login)
        response = { user: userData };
      } else {
        // API login
        response = await API.auth.login(email, password);
      }
      
      const userWithRole = {
        ...(response.user || userData),
        email: email || response.user?.email,
        role: determineUserRole(email || response.user?.email),
        loginTime: new Date().toISOString()
      };
      
      setUser(userWithRole);
      setToken(response.token || 'demo-token');
      localStorage.setItem('token', response.token || 'demo-token');
      sessionStorage.setItem('currentUser', JSON.stringify(userWithRole));
      
      return { success: true, user: userWithRole };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Demo login for testing
  const demoLogin = async (role = 'passenger') => {
    const demoUsers = {
      admin: {
        id: 'ADM-001',
        email: 'admin@abiaway.gov.ng',
        name: 'Admin User',
        role: 'admin',
        tier: 'Administrator',
        avatar: 'AU',
        phone: '+234-803-456-7890',
        joinDate: '2024-01-01'
      },
      driver: {
        id: 'DRV-001',
        email: 'chidi.okonkwo@abiaway.gov.ng',
        name: 'Chidi Okonkwo',
        role: 'driver',
        tier: 'Professional',
        avatar: 'CO',
        phone: '+234-802-345-6789',
        joinDate: '2024-02-20'
      },
      passenger: {
        id: 'USR-001',
        email: 'abuoma@abiaway.gov.ng',
        name: 'Abuoma David',
        role: 'passenger',
        tier: 'Premium',
        avatar: 'AD',
        phone: '+234-801-234-5678',
        joinDate: '2024-01-15'
      }
    };

    const demoUser = demoUsers[role];
    const userWithDetails = {
      ...demoUser,
      loginTime: new Date().toISOString()
    };
    
    setUser(userWithDetails);
    setToken('demo-token-12345');
    localStorage.setItem('token', 'demo-token-12345');
    sessionStorage.setItem('currentUser', JSON.stringify(userWithDetails));
    
    return { success: true, user: demoUser };
  };

  const logout = async () => {
    try {
      // Clear all session and storage data
      await API.auth.logout();
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('rememberedEmail');
      sessionStorage.removeItem('currentUser');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Force clear even if API fails
      setUser(null);
      setToken(null);
      localStorage.clear();
      sessionStorage.clear();
      return { success: true };
    }
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
    return updatedUser;
  };

  // Role check functions
  const hasRole = (role) => user?.role === role;
  const isAdmin = () => user?.role === 'admin';
  const isDriver = () => user?.role === 'driver';

  const value = {
    user,
    token,
    loading,
    login,
    demoLogin,
    logout,
    updateUser,
    isAuthenticated: !!user,
    hasRole,
    isAdmin,
    isDriver
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};