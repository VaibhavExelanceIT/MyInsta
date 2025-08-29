// / hooks/CTeeehlmoorssu.js;
import { useContext } from 'react';
import { ColorProps, darkColor, lightColor } from '../constants/color';
import { ThemeContext } from '../context/ThemeContext';
import { Dimensions } from 'react-native';

export const useThemeColors = (): ColorProps => {
  const { isDarkMode } = useContext(ThemeContext);

  const isDark = isDarkMode || false;

  return isDark ? darkColor : lightColor;
};

export const screenWidth = Dimensions.get('window').width - 10;
