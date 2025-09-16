import React, {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from 'react';
import { useColorScheme } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark' | 'system';

type ThemeContextType = {
  theme: Theme;
  isDarkMode: boolean;
  setTheme: Dispatch<SetStateAction<Theme>>;
  toggleTheme: (newTheme: Theme) => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  isDarkMode: false,
  setTheme: () => {},
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        console.log('🚀 ~ loadTheme ~ savedTheme:', savedTheme);
        if (
          savedTheme === 'light' ||
          savedTheme === 'dark' ||
          savedTheme === 'system'
        ) {
          setTheme(savedTheme);
        }
      } catch (error) {
        console.log('some thing went wrong');
        console.log('Error loading theme:', error);
      }
    };
    loadTheme();
  }, []);

  useEffect(() => {
    console.log('🚀 ~ ThemeContext ~ theme:', theme);

    AsyncStorage.setItem('theme', theme).catch(err =>
      console.log('Error saving theme:', err),
    );
  }, [theme]);

  const isDarkMode =
    theme === 'system' ? systemScheme === 'dark' : theme === 'dark';

  const toggleTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
