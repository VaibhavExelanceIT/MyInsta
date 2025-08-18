import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useThemeColors } from '../hooks/useThemeColors';

interface ComponentProp {
  title: string;
  onclick: () => void;
  imageStyle?: StyleProp<ViewStyle> | undefined;
  textStyle?: StyleProp<TextStyle> | undefined;
}

const ButtonComponent: React.FC<ComponentProp> = props => {
  const { title, onclick, imageStyle, textStyle } = props || {};
  const colors = useThemeColors();
  return (
    <View>
      <TouchableOpacity
        style={[
          styles.btnstyle,
          { backgroundColor: colors.primaryblue },
          imageStyle,
        ]}
        onPress={onclick}
      >
        <Text style={[styles.txtstyle, { color: colors.white }, textStyle]}>
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ButtonComponent;

const styles = StyleSheet.create({
  btnstyle: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 6,
  },
  txtstyle: {
    textAlign: 'center',
  },
});
