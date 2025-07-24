import React from 'react';
import { StyleSheet, TextInput, useColorScheme, View } from 'react-native';

interface ComponentProp {
  PlaceHolder: string;
}

const InputText: React.FC<ComponentProp> = props => {
  const { PlaceHolder } = props || {};
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
      />
    </View>
  );
};

export default InputText;

const styles = StyleSheet.create({
  inputDarkTheme: {
    backgroundColor: '#E8E6E6',
    borderColor: '#E0DDDD',
    color: '#000000',
    borderWidth: 2,
    borderRadius: 6,
    paddingHorizontal: 20,
  },
  inputText: {
    backgroundColor: '#E8E6E6',
    borderColor: '#E0DDDD',
    borderWidth: 2,
    borderRadius: 6,
    paddingHorizontal: 20,
  },
});
