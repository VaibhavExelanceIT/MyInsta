import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useThemeColors } from '../hooks/useThemeColors';

interface ComponentProp {
  title: string;
  onclick: () => void;
}

const ButtonComponent: React.FC<ComponentProp> = props => {
  const { title, onclick } = props || {};
  const colors = useThemeColors();
  return (
    <View>
      <TouchableOpacity
        style={[styles.btnstyle, { backgroundColor: colors.primaryblue }]}
        onPress={onclick}
      >
        <Text style={[styles.txtstyle, { color: colors.white }]}>{title}</Text>
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
