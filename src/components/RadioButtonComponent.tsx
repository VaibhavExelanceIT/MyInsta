import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import React from 'react';
import { RadioButton, useTheme } from 'react-native-paper';
import { useThemeColors } from '../hooks/useThemeColors';

interface ComponentProp {
  value: string;
  onChange: (value: string) => void;
}

const RadioButtonComponent: React.FC<ComponentProp> = props => {
  const { onChange, value } = props || {};
  const theme1 = useTheme();
  const colors = useThemeColors();

  return (
    <View>
      <Text style={{ color: colors.text }}>{'Gender'}</Text>
      <RadioButton.Group value={value} onValueChange={onChange}>
        <View style={styles.radiobtnView}>
          <RadioButton value="Male" theme={theme1} />
          <Text style={{ color: colors.text }}>{'Male'}</Text>
        </View>
        <View style={styles.radiobtnView}>
          <RadioButton value="Female" theme={theme1} />
          <Text style={{ color: colors.text }}>{'Female'}</Text>
        </View>
        <View style={styles.radiobtnView}>
          <RadioButton value="Other" theme={theme1} />
          <Text style={{ color: colors.text }}>{'Other'}</Text>
        </View>
      </RadioButton.Group>
    </View>
  );
};

export default RadioButtonComponent;

const styles = StyleSheet.create({
  radiobtnView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
