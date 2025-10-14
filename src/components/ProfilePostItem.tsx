import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ColorProps } from '../constants/color';
import { useThemeColors } from '../hooks/useThemeColors';
import PostCarouselComponent from './PostModalComponent';

interface ProfileBottomProp {
  image: string[];
}

const ProfilePostItem: React.FC<ProfileBottomProp> = ({ image }) => {
  const [isVisible, setIsVisible] = useState(false);
  const colors = useThemeColors();
  const styles = profileBottomComponentStyle(colors);
  const onImageClick = () => {
    setIsVisible(true);
  };

  return (
    <View style={styles.imageContainerStyle}>
      <TouchableOpacity onPress={onImageClick}>
        <Image source={{ uri: image[0] }} style={styles.imageStyle} />
      </TouchableOpacity>

      {isVisible && (
        <PostCarouselComponent
          imagePost={image}
          isOpen={isVisible}
          setIsImageClicked={setIsVisible}
        />
      )}
    </View>
  );
};

export default ProfilePostItem;

const profileBottomComponentStyle = (colors: ColorProps) =>
  StyleSheet.create({
    imageStyle: { height: 130, maxWidth: 137 },
    imageContainerStyle: {
      flex: 1 / 3,
      alignItems: 'stretch',
      borderWidth: 0.5,

      borderColor: colors.background,
    },
  });
