import React, { useRef, useState } from 'react';
import {
  Alert,
  View,
  Image,
  Modal,
  FlatList,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  GestureHandlerRootView,
  TapGestureHandler,
} from 'react-native-gesture-handler';

import { useThemeColors } from '../hooks/useThemeColors';
import PostCarouselComponent from './PostCarouselComponent';
import { CrossLight } from '../helper/icon';

const screenWidth = Dimensions.get('window').width - 10;
interface ComponentProp {
  imagePost: Array<string>;
}

const CarouselComponent: React.FC<ComponentProp> = props => {
  let { imagePost } = props || {};
  const colors = useThemeColors();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [heart, setHeart] = useState<boolean>(false);

  const [modal, isModalOpen] = useState(false);

  const onImageClick = () => {
    console.log(imagePost);
    isModalOpen(!modal);
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 100,
  });
  const handleDoubleTap = () => {
    console.log('Double tap detected!');
    setHeart(true);
    if (heart) {
      Alert.alert('Liked');
    }
  };
  const ImagePress = () => {
    return <PostCarouselComponent ImagePost={imagePost} />;
  };
  return (
    <View>
      <FlatList
        style={{ backgroundColor: colors.black }}
        keyExtractor={(_, index) => `${index}`}
        data={imagePost}
        horizontal={true}
        scrollEnabled={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        viewabilityConfig={viewabilityConfig.current}
        onViewableItemsChanged={onViewableItemsChanged.current}
        renderItem={({ item }) => {
          console.log(item);
          return (
            <GestureHandlerRootView style={{ flex: 1 }}>
              <TapGestureHandler
                onHandlerStateChange={({ nativeEvent }) => {
                  if (nativeEvent.state === 5) {
                    handleDoubleTap();
                  }
                }}
                numberOfTaps={2}
              >
                <TouchableOpacity onPress={onImageClick}>
                  <Image
                    resizeMethod="resize"
                    resizeMode="contain"
                    source={{
                      uri: item,
                      width: screenWidth,
                      height: 200,
                    }}
                  />
                </TouchableOpacity>
              </TapGestureHandler>
            </GestureHandlerRootView>
          );
        }}
      />
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
              <PostCarouselComponent ImagePost={imagePost} />
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.paginationVIew}>
        {imagePost?.map((_, index) => (
          <View
            style={[
              styles.paginationDotStyle,
              {
                backgroundColor:
                  currentIndex === index ? colors.dashcolor : colors.text,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default CarouselComponent;

const styles = StyleSheet.create({
  videostyle: { height: '100%' },
  paginationVIew: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '10%',
    alignSelf: 'center',
    marginVertical: 10,
  },
  paginationDotStyle: {
    height: 5,
    width: 5,
    borderRadius: 20,
  },

  arrowBtnText: {
    fontSize: 35,
  },
  footer: {
    flexDirection: 'row',
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
