import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { RadioButton, useTheme } from 'react-native-paper';

import { fs } from '../helper/fontSize';
import { ColorProps } from '../constants/color';
import { getText } from '../constants/language/i18next';
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
      <Text style={[styles.textView, styles.titleTextView]}>
        {getText('gender')}
      </Text>
      <RadioButton.Group value={value} onValueChange={onChange}>
        <View style={styles.radioBtnView}>
          <View style={styles.radioBtnView}>
            <RadioButton value="Male" theme={theme} />
            <Text style={styles.textView}>{getText('male')}</Text>
          </View>
          <View style={styles.radioBtnView}>
            <RadioButton value="Female" theme={theme} />
            <Text style={styles.textView}>{getText('female')}</Text>
          </View>
          <View style={styles.radioBtnView}>
            <RadioButton value="Other" theme={theme} />
            <Text style={styles.textView}>{getText('other')}</Text>
          </View>
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
      fontSize: fs(15),
      color: colors.text,
    },
    titleTextView: {
      fontWeight: '500',
      fontSize: fs(16),
    },
  });
