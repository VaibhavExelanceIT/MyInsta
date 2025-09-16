import { useContext } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

export const useTheme = () => {
  const { theme, isDarkMode } = useContext(ThemeContext);
  const systemScheme = useColorScheme();

  return {
    theme,
    isDarkMode,
    colorScheme: theme === 'system' ? systemScheme : theme,
  };
};
