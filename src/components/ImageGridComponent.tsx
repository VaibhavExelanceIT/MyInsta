import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ColorProps } from '../constants/color';
import { useThemeColors } from '../hooks/useThemeColors';

interface ImageGridProp {
  image: string;
}

const ImageGridComponent: React.FC<ImageGridProp> = ({ image }) => {
  const colors = useThemeColors();
  const styles = imageGridComponentStyle(colors);
  return (
    <View style={styles.imagecontainerstyle}>
      <TouchableOpacity>
        <Image source={{ uri: image }} style={styles.imageStyle} />
      </TouchableOpacity>
    </View>
  );
};

export default ImageGridComponent;

const imageGridComponentStyle = (colors: ColorProps) =>
  StyleSheet.create({
    imagecontainerstyle: {
      flex: 1,
      maxWidth: '100%',
    },
    imageStyle: {
      height: 130,
      maxWidth: 137,
    },
  });
