import React from 'react';
import { View, TextInput, StyleSheet, TextInputFocusEvent } from 'react-native';

import { useThemeColors } from '../hooks/useThemeColors';
import { ColorProps } from '../constants/color';
import { useTheme } from '../hooks/useTheme';

interface TextboxProp {
  value: string;
  placeholder: string;
  isEditable?: boolean;
  onChange?: (value: string) => void;
  onBlur?: (e: TextInputFocusEvent) => void;
}

const InputText: React.FC<TextboxProp> = ({
  placeholder,
  onChange,
  value,
  onBlur,
  isEditable,
}) => {
  const { isDarkMode } = useTheme();
  const colors = useThemeColors();
  const styles = inputTextStyle(colors);

  return (
    <View>
      <TextInput
        value={value}
        onBlur={onBlur}
        editable={isEditable}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholderTextColor}
        keyboardAppearance={isDarkMode ? 'dark' : 'light'}
        style={styles.inputText}
      />
    </View>
  );
};

const inputTextStyle = (colors: ColorProps) =>
  StyleSheet.create({
    inputText: {
      marginTop: 20,
      borderWidth: 2,
      borderRadius: 6,
      marginBottom: 10,
      paddingHorizontal: 20,
      color: colors.placeholderTextColor,
      borderColor: colors.inputTextBorder,
      backgroundColor: colors.inputTextBackground,
    },
  });

export default InputText;
