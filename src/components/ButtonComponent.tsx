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
import { CorrectLight, CrossLight } from '../helper/icon';

interface ButtonProp {
  title: string;
  onClick: () => void;
  btnStyle: StyleProp<ViewStyle>;
  textStyle: StyleProp<TextStyle>;
  isAccept?: boolean;
  isDecline?: boolean;
}

const ButtonComponent: React.FC<ButtonProp> = ({
  title,
  onClick,
  btnStyle,
  textStyle,
  isAccept,
  isDecline,
}) => {
  return (
    <View style={styles.containerStyle}>
      <TouchableOpacity style={btnStyle} onPress={onClick}>
        <View style={{ flex: 1, alignSelf: 'center' }}>
          {isAccept ? (
            <CorrectLight height={20} width={20} />
          ) : isDecline ? (
            <CrossLight height={20} width={20} />
          ) : null}
        </View>

        <Text style={[textStyle, styles.text]}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
  },
  containerStyle: { flex: 1 },
});
export default ButtonComponent;
