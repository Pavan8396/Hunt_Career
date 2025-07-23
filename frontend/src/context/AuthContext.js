import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem('token'));
  const [username, setUsername] = useState(sessionStorage.getItem('username') || '');
  const [token, setToken] = useState(sessionStorage.getItem('token') || null);
  const [userType, setUserType] = useState(sessionStorage.getItem('userType') || '');

  const login = (newToken, user, type = 'user') => {
    sessionStorage.setItem('token', newToken);
    sessionStorage.setItem('username', user);
    sessionStorage.setItem('userType', type);
    setToken(newToken);
    setIsAuthenticated(true);
    setUsername(user);
    setUserType(type);
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('userType');
    setToken(null);
    setIsAuthenticated(false);
    setUsername('');
    setUserType('');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, token, userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};