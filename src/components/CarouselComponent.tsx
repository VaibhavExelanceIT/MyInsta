import React, { useRef, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ImageResizeMode,
  TouchableOpacity,
} from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ColorProps } from '../constants/color';
import PostCarouselComponent from './PostModalComponent';
import RenderImageComponent from './RenderImageComponent';
import { screenWidth, useThemeColors } from '../hooks/useThemeColors';

interface CarouselProp {
  height: number;
  clickEnable: boolean;
  imagePost: Array<string>;
  reSizeMode: ImageResizeMode | undefined;
  reSizeMethod: 'auto' | 'resize' | 'scale' | 'none' | undefined;
}

const CarouselComponent: React.FC<CarouselProp> = ({
  height,
  imagePost,
  reSizeMode,
  clickEnable,
  reSizeMethod,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const colors = useThemeColors();
  const styles = carouselComponentStyle(colors);
  const onImageClick = () => {
    setIsVisible(true);
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 100,
  });

  return (
    <View>
      <FlatList
        style={styles.flatListStyle}
        keyExtractor={i => `${i}`}
        data={imagePost}
        horizontal={true}
        scrollEnabled={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        viewabilityConfig={viewabilityConfig.current}
        onViewableItemsChanged={onViewableItemsChanged.current}
        renderItem={({ item }) => {
          return (
            <GestureHandlerRootView style={styles.gestureStyle}>
              <TouchableOpacity disabled={!clickEnable} onPress={onImageClick}>
                <RenderImageComponent
                  imageUri={item}
                  width={screenWidth}
                  reSizeMethod={reSizeMethod}
                  reSizeMode={reSizeMode}
                  height={height}
                />
              </TouchableOpacity>
            </GestureHandlerRootView>
          );
        }}
      />
      <View style={styles.paginationView}>
        {imagePost?.map((_, index) => (
          <View
            style={[
              styles.paginationDotStyle,
              {
                backgroundColor:
                  currentIndex === index
                    ? colors.primaryblue
                    : colors.dashcolor,
              },
            ]}
          />
        ))}
      </View>
      {clickEnable && isVisible && (
        <PostCarouselComponent
          imagePost={imagePost}
          isOpen={isVisible}
          setIsImageClicked={setIsVisible}
        />
      )}
    </View>
  );
};

export default CarouselComponent;

const carouselComponentStyle = (colors: ColorProps) =>
  StyleSheet.create({
    flatListStyle: { backgroundColor: colors.black },

    gestureStyle: { flex: 1 },

    paginationView: {
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
  });
