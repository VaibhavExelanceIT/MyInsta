import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ColorProps } from '../constants/color';
import { useThemeColors } from '../hooks/useThemeColors';
interface TextProps {
  textTitle: string;
  textData: number;
}

const ProfileTextComponent: React.FC<TextProps> = ({ textTitle, textData }) => {
  const colors = useThemeColors();
  const styles = profileTextComponentStyle(colors);
  return (
    <View style={styles.textStyle}>
      <Text style={styles.textColor}>{textData}</Text>
      <Text style={styles.textColor}>{textTitle}</Text>
    </View>
  );
};

export default ProfileTextComponent;

const profileTextComponentStyle = (colors: ColorProps) =>
  StyleSheet.create({
    textStyle: {
      flex: 1,
      alignSelf: 'center',
      alignItems: 'center',
    },
    textColor: {
      fontWeight: '600',
      color: colors.text,
    },
  });
