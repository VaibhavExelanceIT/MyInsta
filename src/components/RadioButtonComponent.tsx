import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import React from 'react';
import { RadioButton, useTheme } from 'react-native-paper';

interface ComponentProp {
  value: string;
  onChange: (value: string) => void;
}

const RadioButtonComponent: React.FC<ComponentProp> = props => {
  const { onChange, value } = props || {};
  const theme1 = useTheme();

  const colorScheme = useColorScheme();
  return (
    <View>
      <Text style={colorScheme === 'dark' ? styles.genderTextStyle : {}}>
        {'Gender'}
      </Text>
      <RadioButton.Group value={value} onValueChange={onChange}>
        <View style={styles.radiobtnView}>
          <RadioButton value="Male" theme={theme1} />
          <Text style={colorScheme === 'dark' ? styles.genderTextStyle : {}}>
            {'Male'}
          </Text>
        </View>
        <View style={styles.radiobtnView}>
          <RadioButton value="Female" theme={theme1} />
          <Text style={colorScheme === 'dark' ? styles.genderTextStyle : {}}>
            {'Female'}
          </Text>
        </View>
        <View style={styles.radiobtnView}>
          <RadioButton value="Other" theme={theme1} />
          <Text style={colorScheme === 'dark' ? styles.genderTextStyle : {}}>
            {'Other'}
          </Text>
        </View>
      </RadioButton.Group>
    </View>
  );
};

export default RadioButtonComponent;

const styles = StyleSheet.create({
  genderTextStyle: {
    color: '#FFFFFF',
  },
  radiobtnView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
