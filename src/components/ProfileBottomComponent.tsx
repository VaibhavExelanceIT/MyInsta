import { Image, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';

import { colors } from '../hooks/useThemeColors';
import { CrossLight } from '../helper/icon';
import PostCarouselComponent from './PostCarouselComponent';

interface ComponentProp {
  image: string[];
}

const ProfileBottomComponent: React.FC<ComponentProp> = props => {
  const { image } = props || {};
  console.log('🚀 ~ ProfileBottomComponent ~ image:', image);
  const [modal, isModalOpen] = useState(false);

  const onImageClick = () => {
    console.log(image);
    isModalOpen(!modal);
  };
  return (
    <View
      style={[styles.imagecontainerstyle, { borderColor: colors.background }]}
    >
      <TouchableOpacity onPress={onImageClick}>
        <Image
          source={{ uri: image[0] }}
          style={{ height: 130, maxWidth: 137 }}
        />
      </TouchableOpacity>
      <Modal
        transparent={false}
        animationType="slide"
        visible={modal}
        onRequestClose={() => {
          isModalOpen(!modal);
        }}
      >
        <View style={styles.centeredView}>
          <View
            style={[
              styles.modalView,
              { backgroundColor: '#000000', shadowColor: colors.text },
            ]}
          >
            <TouchableOpacity
              onPress={onImageClick}
              style={{ flexDirection: 'row-reverse', marginBottom: 10 }}
            >
              <CrossLight height={30} width={30} />
            </TouchableOpacity>
            <View style={styles.ImageCarousel}>
              <PostCarouselComponent ImagePost={image} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileBottomComponent;

const styles = StyleSheet.create({
  imagecontainerstyle: {
    borderWidth: 0.5,

    flex: 1,
  },
  centeredView: {
    flex: 1,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalView: {
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
  ImageCarousel: {
    flex: 1,
    justifyContent: 'center',
  },
});
