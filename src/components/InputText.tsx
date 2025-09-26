import React, { useState } from 'react';
import {
  View,
  Image,
  TextInput,
  StyleSheet,
  I18nManager,
  TouchableOpacity,
  TextInputFocusEvent,
} from 'react-native';

import { useTheme } from '../hooks/useTheme';
import { ColorProps } from '../constants/color';
import { closeEye, openEye } from '../helper/images';
import { useThemeColors } from '../hooks/useThemeColors';

interface TextboxProp {
  value: string;
  placeholder: string;
  isEditable?: boolean;

  onChange?: (value: string) => void;
  onBlur?: (e: TextInputFocusEvent) => void;
  isMobileNo?: boolean;
  isPassword?: boolean;
}

const InputText: React.FC<TextboxProp> = ({
  value,
  onBlur,
  onChange,
  isEditable,
  isMobileNo,
  isPassword,
  placeholder,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const { isDarkMode } = useTheme();
  const colors = useThemeColors();
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prev => !prev);
  };
  const isRTL = I18nManager.isRTL;
  const styles = inputTextStyle(colors, isRTL);

  return (
    <View style={styles.passwordContainer}>
      <TextInput
        value={value}
        onBlur={onBlur}
        editable={isEditable}
        onChangeText={onChange}
        style={styles.inputText}
        placeholder={placeholder}
        maxLength={isMobileNo ? 10 : 100}
        placeholderTextColor={colors.placeholderTextColor}
        keyboardAppearance={isDarkMode ? 'dark' : 'light'}
        secureTextEntry={isPassword && !isPasswordVisible}
        keyboardType={isMobileNo ? 'number-pad' : 'default'}
      />
      {isPassword && (
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.eyeIcon}
        >
          <Image
            source={isPasswordVisible ? openEye : closeEye}
            style={styles.imageStyle}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const inputTextStyle = (colors: ColorProps, isRTL: boolean) =>
  StyleSheet.create({
    imageStyle: { width: 20, height: 20 },
    passwordContainer: {
      marginTop: 20,
      borderWidth: 2,
      borderRadius: 8,
      marginBottom: 10,
      alignItems: 'center',
      flexDirection: 'row',
      paddingHorizontal: 10,
      borderColor: colors.inputTextBorder,
      backgroundColor: colors.inputTextBackground,
    },
    inputText: {
      flex: 1,
      color: colors.placeholderTextColor,
      borderColor: colors.inputTextBorder,
      textAlign: isRTL ? 'right' : 'left',
      backgroundColor: colors.inputTextBackground,
    },
    eyeIcon: {
      padding: 5,
    },
  });

export default InputText;
