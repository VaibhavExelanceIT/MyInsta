import React, {
  useState,
  Dispatch,
  useEffect,
  createContext,
  SetStateAction,
} from 'react';
import { useColorScheme } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';

import { t } from 'i18next';

import { LanguageConstant } from '../constants/language_constants';

type Theme = 'light' | 'dark' | 'system';

type ThemeContextType = {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: (newTheme: Theme) => void;
  setTheme: Dispatch<SetStateAction<Theme>>;
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

        if (
          savedTheme === 'light' ||
          savedTheme === 'dark' ||
          savedTheme === 'system'
        ) {
          setTheme(savedTheme);
        }
      } catch (error) {
        showMessage({
          message: t(LanguageConstant.error),
          description: t(LanguageConstant.failedloadThemePreference),
          type: 'danger',
        });
      }
    };
    loadTheme();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('theme', theme).catch(err =>
      showMessage({
        message: t(LanguageConstant.error),
        description: t(LanguageConstant.failedSaveThemePreference),
        type: 'danger',
      }),
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
