import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  useColorScheme,
  TextInputFocusEvent,
} from 'react-native';
import { useThemeColors } from '../hooks/useThemeColors';

interface ComponentProp {
  value: string;
  PlaceHolder: string;
  isEditable?: boolean;
  onChange?: (value: string) => void;
  onBlur?: (e: TextInputFocusEvent) => void;
}

const InputText: React.FC<ComponentProp> = props => {
  const { PlaceHolder, onChange, value, onBlur, isEditable } = props || {};
  const colorScheme = useColorScheme();
  const colors = useThemeColors();
  return (
    <View>
      <TextInput
        keyboardAppearance={colorScheme === 'dark' ? 'dark' : 'light'}
        style={
          colorScheme === 'dark'
            ? [
                styles.inputDarkTheme,
                {
                  color: colors.placeholderTextColor,
                  backgroundColor: colors.inputTextBackground,
                  borderColor: colors.inputTextBorder,
                },
              ]
            : [
                styles.inputText,
                {
                  color: colors.placeholderTextColor,
                  backgroundColor: colors.inputTextBackground,
                  borderColor: colors.inputTextBorder,
                },
              ]
        }
        placeholder={PlaceHolder}
        placeholderTextColor={colors.placeholderTextColor}
        onChangeText={onChange}
        value={value}
        onBlur={onBlur}
        editable={isEditable}
      />
    </View>
  );
};

export default InputText;

const styles = StyleSheet.create({
  inputDarkTheme: {
    marginTop: 20,
    marginBottom: 10,
    borderWidth: 2,
    borderRadius: 6,
    paddingHorizontal: 20,
  },
  inputText: {
    marginTop: 20,
    marginBottom: 10,
    borderWidth: 2,
    borderRadius: 6,
    paddingHorizontal: 20,
  },
});
