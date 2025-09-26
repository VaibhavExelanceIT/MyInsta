import React, { useContext, useRef } from 'react';
import {
  View,
  Image,
  Animated,
  StyleSheet,
  I18nManager,
  TouchableOpacity,
} from 'react-native';

import { ColorProps } from '../constants/color';
import { darkMode, lightMode } from '../helper/images';
import { ThemeContext } from '../context/ThemeContext';
import { useThemeColors } from '../hooks/useThemeColors';

const ThemeSwitch = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const translateX = useRef(new Animated.Value(isDarkMode ? 20 : 0)).current;

  const toggleSwitch = () => {
    const nextTheme = isDarkMode ? 'light' : 'dark';
    toggleTheme(nextTheme);

    const offset = I18nManager.isRTL ? -20 : 20;

    Animated.timing(translateX, {
      toValue: isDarkMode ? 0 : offset,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const colors = useThemeColors();
  const styles = ThemeSwitchStyle(colors);

  return (
    <View style={styles.container}>
      {isDarkMode ? (
        <Image source={darkMode} style={styles.imageView} />
      ) : (
        <Image source={lightMode} style={styles.imageView} />
      )}

      <TouchableOpacity
        style={styles.switch}
        onPress={toggleSwitch}
        activeOpacity={0.8}
      >
        <Animated.View
          style={[
            styles.circle,
            {
              transform: [{ translateX }],
            },
          ]}
        />
      </TouchableOpacity>
    </View>
  );
};

const ThemeSwitchStyle = (color: ColorProps) =>
  StyleSheet.create({
    imageView: { height: 30, width: 30 },
    container: {
      marginHorizontal: 10,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    switch: {
      width: 50,
      height: 28,
      borderRadius: 20,
      backgroundColor: color.text,
      justifyContent: 'center',
      paddingHorizontal: 4,
    },
    circle: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: color.background,
    },
  });

export default ThemeSwitch;
