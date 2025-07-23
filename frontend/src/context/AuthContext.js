import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem('token'));
  const [username, setUsername] = useState(sessionStorage.getItem('username') || '');
  const [userType, setUserType] = useState(sessionStorage.getItem('userType') || '');

  const login = (token, user, type = 'user') => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('username', user);
    sessionStorage.setItem('userType', type);
    setIsAuthenticated(true);
    setUsername(user);
    setUserType(type);
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('userType');
    setIsAuthenticated(false);
    setUsername('');
    setUserType('');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};