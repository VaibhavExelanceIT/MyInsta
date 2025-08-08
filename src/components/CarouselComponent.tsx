import React, { useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import {
  GestureHandlerRootView,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import { useThemeColors } from '../hooks/useThemeColors';

const screenWidth = Dimensions.get('window').width;
interface ComponentProp {
  ImagePost: Array<string>;
}

const CarouselComponent: React.FC<ComponentProp> = props => {
  let { ImagePost } = props || {};
  const colors = useThemeColors();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [heart, setHeart] = useState<boolean>(false);

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
  return (
    <View>
      <FlatList
        style={{ backgroundColor: colors.black }}
        keyExtractor={(_, index) => `${index}`}
        data={ImagePost}
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
                    // State 5 indicates gesture has ended
                    handleDoubleTap();
                  }
                }}
                numberOfTaps={2} // Specify that you're looking for a double tap
              >
                <Image
                  resizeMethod="resize"
                  resizeMode="contain"
                  source={{
                    uri: item,
                    width: screenWidth,
                    height: 200,
                  }}
                />
              </TapGestureHandler>
            </GestureHandlerRootView>
          );
        }}
      />

      <View style={styles.paginationVIew}>
        {ImagePost?.map((_, index) => (
          <View
            style={[
              styles.paginationDotStyle,
              {
                backgroundColor:
                  currentIndex === index ? '#222' : colors.paginationbackground,
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
    borderRadius: 10,
  },

  arrowBtnText: {
    fontSize: 35,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
