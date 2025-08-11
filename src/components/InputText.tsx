import React from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputFocusEvent,
  useColorScheme,
  View,
} from 'react-native';

interface ComponentProp {
  PlaceHolder: string;
  value: string;
  onChange?: (value: string) => void;
  onBlur?: (e: TextInputFocusEvent) => void;
  isEditable?: boolean;
}

const InputText: React.FC<ComponentProp> = props => {
  const { PlaceHolder, onChange, value, onBlur, isEditable } = props || {};
  const colorScheme = useColorScheme();
  return (
    <View>
      <TextInput
        keyboardAppearance={colorScheme === 'dark' ? 'dark' : 'light'}
        style={
          colorScheme === 'dark' ? styles.inputDarkTheme : styles.inputText
        }
        placeholder={PlaceHolder}
        placeholderTextColor={colorScheme === 'light' ? '#BOBOBO' : '#000000'}
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
    backgroundColor: '#E8E6E6',
    borderColor: '#E0DDDD',
    color: '#000000',
    borderWidth: 2,
    borderRadius: 6,
    paddingHorizontal: 20,
  },
  inputText: {
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: '#E8E6E6',
    borderColor: '#E0DDDD',
    borderWidth: 2,
    borderRadius: 6,
    paddingHorizontal: 20,
  },
});
