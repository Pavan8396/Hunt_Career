import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')) || null);
  const [token, setToken] = useState(sessionStorage.getItem('token') || null);
  const [userType, setUserType] = useState(sessionStorage.getItem('userType') || '');

  const login = (newToken, userData, type = 'user') => {
    if (!userData) {
      console.error("Login function called with undefined userData.");
      return;
    }
    const userWithType = { ...userData, type };
    sessionStorage.setItem('token', newToken);
    sessionStorage.setItem('user', JSON.stringify(userWithType));
    sessionStorage.setItem('userType', type);
    setToken(newToken);
    setIsAuthenticated(true);
    setUser(userWithType);
    setUserType(type);
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('userType');
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
    setUserType('');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};