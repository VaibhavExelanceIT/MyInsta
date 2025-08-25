import React from 'react';
import {
  Text,
  View,
  StyleProp,
  TextStyle,
  ViewStyle,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

interface ButtonProp {
  title: string;
  onClick: () => void;
  btnStyle: StyleProp<ViewStyle>;
  textStyle: StyleProp<TextStyle>;
}

const ButtonComponent: React.FC<ButtonProp> = ({
  title,
  onClick,
  btnStyle,
  textStyle,
}) => {
  return (
    <View style={styles.containerStyle}>
      <TouchableOpacity style={btnStyle} onPress={onClick}>
        <Text style={textStyle}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: { flex: 1 },
});
export default ButtonComponent;
