import React from 'react';
import { Image, ImageResizeMode, View } from 'react-native';

interface RenderImageProp {
  width: number;
  imageUri: string;
  reSizeMethod: 'auto' | 'resize' | 'scale' | 'none' | undefined;
  reSizeMode: ImageResizeMode | undefined;
  height: number;
}

const RenderImageComponent: React.FC<RenderImageProp> = ({
  width,
  height,
  imageUri,
  reSizeMode,
  reSizeMethod,
}) => {
  return (
    <View>
      <Image
        resizeMethod={reSizeMethod}
        resizeMode={reSizeMode}
        source={{
          uri: imageUri,
          width: width,
          height: height,
        }}
      />
    </View>
  );
};

export default RenderImageComponent;
