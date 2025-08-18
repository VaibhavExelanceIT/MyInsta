import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';

interface ComponentProp {
  image: string;
}

const ImageGridComponent: React.FC<ComponentProp> = props => {
  const { image } = props || {};
  console.log('🚀 ~ ImageGridComponent ~ image:', image);

  return (
    <View style={styles.imagecontainerstyle}>
      <TouchableOpacity>
        <Image source={{ uri: image }} style={{ height: 130, maxWidth: 137 }} />
      </TouchableOpacity>
    </View>
  );
};

export default ImageGridComponent;

const styles = StyleSheet.create({
  imagecontainerstyle: {
    flex: 1,
    maxWidth: '100%',
  },
});
