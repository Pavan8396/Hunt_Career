import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { updateUserTheme, updateEmployerTheme } from '../services/api';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, token, userType } = useContext(AuthContext);

  useEffect(() => {
    const currentTheme = user?.theme || localStorage.getItem('theme') || 'light';
    setIsDarkMode(currentTheme === 'dark');
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [user]);

  const toggleDarkMode = async () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');

    if (token) {
      try {
        if (userType === 'employer') {
          await updateEmployerTheme(newTheme, token);
        } else {
          await updateUserTheme(newTheme, token);
        }
      } catch (error) {
        console.error('Failed to save theme preference:', error);
        // Revert UI change if API call fails
        setIsDarkMode(isDarkMode);
        document.documentElement.classList.toggle('dark');
      }
    } else {
      localStorage.setItem('theme', newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};