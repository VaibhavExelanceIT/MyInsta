// src/hooks/useThemeColors.js
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { darkColor, lightColor } from '../constants/color';

export const useThemeColors = () => {
  const { isDarkMode } = useContext(ThemeContext);
  return isDarkMode ? darkColor : lightColor;
};

export const colors = useThemeColors();
