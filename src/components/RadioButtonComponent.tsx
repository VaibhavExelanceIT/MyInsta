import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { RadioButton, useTheme } from 'react-native-paper';
import { ColorProps } from '../constants/color';
import { useThemeColors } from '../hooks/useThemeColors';

interface RadioButtonProp {
  value: string;
  onChange: (value: string) => void;
}
const RadioButtonComponent: React.FC<RadioButtonProp> = ({
  value,
  onChange,
}) => {
  const theme = useTheme();
  const colors = useThemeColors();
  const styles = radioButtonComponentStyle(colors);
  return (
    <View>
      <Text style={styles.textView}>{'Gender'}</Text>
      <RadioButton.Group value={value} onValueChange={onChange}>
        <View style={styles.radioBtnView}>
          <RadioButton value="Male" theme={theme} />
          <Text style={styles.textView}>{'Male'}</Text>
        </View>
        <View style={styles.radioBtnView}>
          <RadioButton value="Female" theme={theme} />
          <Text style={styles.textView}>{'Female'}</Text>
        </View>
        <View style={styles.radioBtnView}>
          <RadioButton value="Other" theme={theme} />
          <Text style={styles.textView}>{'Other'}</Text>
        </View>
      </RadioButton.Group>
    </View>
  );
};

export default RadioButtonComponent;

const radioButtonComponentStyle = (colors: ColorProps) =>
  StyleSheet.create({
    radioBtnView: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    textView: {
      color: colors.text,
    },
  });
