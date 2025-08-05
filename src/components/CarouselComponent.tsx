import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, View } from 'react-native';

const screenWidth = Dimensions.get('window').width;
interface ComponentProp {
  ImagePost: Array<string>;
}

const CarouselComponent: React.FC<ComponentProp> = props => {
  let { ImagePost } = props || {};
  const [currentIndex, setCurrentIndex] = useState(0);

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
        style={styles.flatliststyle}
        // key={currentIndex}
        keyExtractor={(_, index) => `${index}`}
        data={ImagePost}
        horizontal={true}
        scrollEnabled={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        viewabilityConfig={viewabilityConfig.current}
        onViewableItemsChanged={onViewableItemsChanged.current}
        renderItem={({ item }) => {
          let url = item;
          // const ext = item.split('.').pop();
          {
            console.log(url);
          }
          return (
            <Image
              resizeMode="contain"
              source={{
                uri: url,
                width: screenWidth,
              }}
            />
          );
          // return ext === 'jpg' ? (
          //   <Image
          //     resizeMode="contain"
          //     source={{
          //       uri: url,
          //       width: screenWidth,
          //     }}
          //   />
          // ) : (
          //   <View>
          //     {/* <Video
          //       style={[styles.videostyle, { width: screenWidth }]}
          //       source={{ uri: url }}
          //       controls
          //       muted={false}
          //       repeat={true}
          //       paused={false}
          //       resizeMode={'contain'}
          //     /> */}
          //   </View>
          // );
        }}
      />

      <View style={styles.paginationVIew}>
        {/* {ImagePost?.map((_, index) => (
          <View
            style={[
              styles.paginationDotStyle,
              { backgroundColor: currentIndex === index ? '#222' : '#aaa' },
            ]}
          />
        ))} */}
      </View>
    </View>
  );
};

export default CarouselComponent;

const styles = StyleSheet.create({
  flatliststyle: { backgroundColor: '#111111' },
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
    backgroundColor: '#aaa',
  },
  arrowBtn: {},
  arrowBtnText: {
    fontSize: 35,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
