import React, { useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import { useThemeColors } from '../hooks/useThemeColors';

const screenWidth = Dimensions.get('window').width - 10;
interface ComponentProp {
  ImagePost: Array<string>;
}
const PostCarouselComponent: React.FC<ComponentProp> = props => {
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
    <View style={{ flex: 1 }}>
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
            <Image
              resizeMethod="scale"
              resizeMode="contain"
              source={{
                uri: item,
                width: screenWidth,
                height: 750,
              }}
            />
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
                  currentIndex === index
                    ? colors.white
                    : colors.commentTextStyle,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default PostCarouselComponent;
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
});
