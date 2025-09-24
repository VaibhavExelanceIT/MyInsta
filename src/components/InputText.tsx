import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputFocusEvent,
  TouchableOpacity,
  Image,
  I18nManager,
} from 'react-native';

import { useTheme } from '../hooks/useTheme';
import { ColorProps } from '../constants/color';
import { useThemeColors } from '../hooks/useThemeColors';
import { closeEye, openEye } from '../helper/images';

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
  placeholder,
  isPassword,
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
            style={{ width: 20, height: 20 }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const inputTextStyle = (colors: ColorProps, isRTL: boolean) =>
  StyleSheet.create({
    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 8,
      marginTop: 20,
      borderWidth: 2,

      marginBottom: 10,
      paddingHorizontal: 10,
      borderColor: colors.inputTextBorder,
      backgroundColor: colors.inputTextBackground,
    },
    inputText: {
      textAlign: isRTL ? 'right' : 'left',
      flex: 1,
      color: colors.placeholderTextColor,
      borderColor: colors.inputTextBorder,
      backgroundColor: colors.inputTextBackground,
    },
    eyeIcon: {
      padding: 5,
    },
  });

export default InputText;
