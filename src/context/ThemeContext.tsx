import React, {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
} from 'react';
import { useColorScheme } from 'react-native';
type ThemeContextType = {
  isDarkMode: boolean | null;
  setIsDarkMode: Dispatch<SetStateAction<boolean | null>>;
};
export const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  setIsDarkMode: () => {},
});
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(
    colorScheme === 'dark',
  );

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
