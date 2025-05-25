import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem('token')); // Changed to sessionStorage
  const [username, setUsername] = useState(sessionStorage.getItem('username') || ''); // Changed to sessionStorage

  const login = (token, user) => {
    sessionStorage.setItem('token', token); // Changed to sessionStorage
    sessionStorage.setItem('username', user); // Changed to sessionStorage
    setIsAuthenticated(true);
    setUsername(user);
  };

  const logout = () => {
    sessionStorage.removeItem('token'); // Changed to sessionStorage
    sessionStorage.removeItem('username'); // Changed to sessionStorage
    setIsAuthenticated(false);
    setUsername('');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};