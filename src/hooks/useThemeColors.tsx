// / hooks/CTeeehlmoorssu.js;
import { useContext } from 'react';
import { Dimensions } from 'react-native';

import { ThemeContext } from '../context/ThemeContext';
import { ColorProps, darkColor, lightColor } from '../constants/color';

export const useThemeColors = (): ColorProps => {
  const { isDarkMode } = useContext(ThemeContext);

  const isDark = isDarkMode || false;

  return isDark ? darkColor : lightColor;
};

export const screenWidth = Dimensions.get('window').width;
