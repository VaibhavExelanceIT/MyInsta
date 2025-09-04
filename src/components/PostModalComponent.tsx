import React, { useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';

import { CrossLight } from '../helper/icon';
import { ColorProps } from '../constants/color';
import CarouselComponent from './CarouselComponent';
import { useThemeColors } from '../hooks/useThemeColors';

interface PostCarouselProp {
  isOpen: boolean;
  imagePost: Array<string>;
  setIsImageClicked: React.Dispatch<React.SetStateAction<boolean>>;
}
const PostCarouselComponent: React.FC<PostCarouselProp> = ({
  isOpen,
  imagePost,
  setIsImageClicked,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(isOpen);

  const colors = useThemeColors();
  const styles = postCarouselComponentStyle(colors);
  const onModalClose = () => {
    setIsModalOpen(false);
    setIsImageClicked(false);
  };

  return (
    <View style={styles.flatListView}>
      <Modal
        transparent={false}
        animationType="slide"
        visible={isModalOpen}
        onRequestClose={onModalClose}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity onPress={onModalClose} style={styles.btnStyle}>
              <CrossLight height={30} width={30} />
            </TouchableOpacity>

            <View style={styles.imageCarousel}>
              <CarouselComponent
                imagePost={imagePost}
                reSizeMethod="scale"
                reSizeMode="contain"
                height={700}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PostCarouselComponent;
const postCarouselComponentStyle = (colors: ColorProps) =>
  StyleSheet.create({
    flatListView: { flex: 1 },

    btnStyle: {
      flexDirection: 'row-reverse',
      marginBottom: 10,
    },
    imageCarousel: {
      flex: 1,
      justifyContent: 'center',
    },
    centeredView: {
      flex: 1,
      height: '100%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalView: {
      flex: 1,
      backgroundColor: colors.black,
      shadowColor: colors.text,
      padding: 5,
      elevation: 5,
      height: '100%',
      width: '100%',
      shadowRadius: 4,
      shadowOpacity: 0.25,

      shadowOffset: {
        width: 0,
        height: 2,
      },
    },
  });
