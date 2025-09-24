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

import { SvgProps } from 'react-native-svg';

import { fs } from '../helper/fontSize';

interface ButtonProp {
  title: string;
  onClick: () => void;
  btnStyle: StyleProp<ViewStyle>;
  textStyle: StyleProp<TextStyle>;

  IconComponent?: React.FC<SvgProps> | undefined;
}

const ButtonComponent: React.FC<ButtonProp> = ({
  title,
  onClick,
  btnStyle,
  textStyle,
  IconComponent,
}) => {
  return (
    <View style={styles.containerStyle}>
      <TouchableOpacity style={btnStyle} onPress={onClick}>
        <View style={{ flex: 1, alignSelf: 'center' }}>
          {IconComponent && <IconComponent height={fs(20)} width={fs(20)} />}
        </View>

        <Text style={[styles.text, textStyle]}>{title}</Text>
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
