import React from 'react';
import { View } from 'react-native';

import CarouselComponent from './CarouselComponent';

interface ImagesProp {
  imagePost: Array<string>;
}

const ImagesComponent: React.FC<ImagesProp> = ({ imagePost }) => {
  return (
    <View>
      <CarouselComponent
        imagePost={imagePost}
        reSizeMethod="resize"
        reSizeMode="contain"
        height={200}
      />
    </View>
  );
};

export default ImagesComponent;
