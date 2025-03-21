import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors as constantColors } from '@config/constants';

// Define theme types
export type ThemeType = 'light' | 'dark' | 'system';

// Define theme colors
export const lightColors = {
  ...constantColors,
  primary: '#2196f3',
  background: '#FFFFFF',
  card: '#F8F9FA',
  text: '#333333',
  textSecondary: '#787878',
  border: '#E0E0E0',
  notification: '#FF3B30',
  inputBackground: '#F7F7F7',
  inputBorder: '#F0F0F0',
  buttonText: '#FFFFFF',
};

export const darkColors = {
  ...constantColors,
  primary: '#53A0F4',
  background: '#121212',
  card: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',
  border: '#2C2C2C',
  notification: '#FF453A',
  inputBackground: '#2C2C2C',
  inputBorder: '#3D3D3D',
  buttonText: '#FFFFFF',
};

// Create the context interface
interface ThemeContextType {
  theme: ThemeType;
  colors: typeof lightColors;
  isDark: boolean;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
}

// Create context with default values
export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  colors: lightColors,
  isDark: false,
  setTheme: () => {},
  toggleTheme: () => {},
});

// Create the provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeType>('light');
  const [isLoading, setIsLoading] = useState(true);

  // Load saved theme on startup
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) {
          setThemeState(savedTheme as ThemeType);
        } else {
          setThemeState('system');
        }
      } catch (error) {
        console.error('Error loading theme', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, []);

  // Save theme changes
  const setTheme = async (newTheme: ThemeType) => {
    try {
      await AsyncStorage.setItem('theme', newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.error('Error saving theme', error);
    }
  };

  // Toggle between light and dark
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  // Determine if we're in dark mode
  const isDark = theme === 'dark' || (theme === 'system' && systemColorScheme === 'dark');

  // Choose colors based on dark mode status
  const colors = isDark ? darkColors : lightColors;

  if (isLoading) {
    // Return basic provider during loading to avoid errors
    return (
      <ThemeContext.Provider
        value={{
          theme: 'light',
          colors: lightColors,
          isDark: false,
          setTheme,
          toggleTheme,
        }}
      >
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colors,
        isDark,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using the theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
