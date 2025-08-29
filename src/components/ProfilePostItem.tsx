import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';

import PostCarouselComponent from './PostModalComponent';
import { ColorProps } from '../constants/color';
import { useThemeColors } from '../hooks/useThemeColors';

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
    buttonStyle: { flexDirection: 'row-reverse', marginBottom: 10 },
    imageStyle: { height: 130, maxWidth: 137 },
    imageContainerStyle: {
      flex: 1,
      borderWidth: 0.5,
      borderColor: colors.background,
    },
    centeredView: {
      flex: 1,
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalView: {
      padding: 5,
      elevation: 5,
      width: '100%',
      height: '100%',
      shadowRadius: 4,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowColor: colors.text,
      backgroundColor: colors.black,
    },
    imageCarousel: {
      flex: 1,
      justifyContent: 'center',
    },
  });
