import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ComponentProp {
  title: string;
  onclick: () => void;
}

const ButtonComponent: React.FC<ComponentProp> = props => {
  const { title, onclick } = props || {};

  return (
    <View>
      <TouchableOpacity style={styles.btnstyle} onPress={onclick}>
        <Text style={styles.txtstyle}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ButtonComponent;

const styles = StyleSheet.create({
  btnstyle: {
    marginVertical: 10,
    backgroundColor: '#1877F2',
    padding: 10,
    borderRadius: 6,
  },
  txtstyle: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
