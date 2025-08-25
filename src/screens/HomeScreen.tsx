import {
  View,
  Image,
  FlatList,
  StyleSheet,
  RefreshControl,
  useColorScheme,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';

import firestore from '@react-native-firebase/firestore';

import {
  Message,
  HeartDark,
  MessageDark,
  SettingMenu,
  HeartOutline,
  SettingMenuDark,
} from '../helper/icon';
import PostComponent from '../components/PostComponent';
import { instadark, instalight } from '../helper/images';

import { showMessage } from 'react-native-flash-message';
import { useThemeColors } from '../hooks/useThemeColors';
import { ColorProps } from '../constants/color';

interface Post {
  id: string;
  like: number;
  title: string;
  comment: number;
  userimage: string;
  dateAndTime: string;
  description: string;
  postURL: Array<string>;
}

const HomeScreen = ({ navigation }: any) => {
  const usersData: any[] = [];

  const [isloading, setIsLoading] = useState(true);
  const [post, setPost] = useState<Post[]>([]);
  const [isrefreshing, setIsRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const colors = useThemeColors();
  const styles = homeScreenStyle(colors);

  const onRefresh = () => {
    setIsRefreshing(true);
    getPost();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };
  const getData = async (id: string) => {
    const data = await firestore()
      .collection('UsersData')
      .doc(id)
      .collection('PostData')
      .get();

    data.docs.forEach(item => {
      setPost(prevState => [...prevState, item.data() as Post]);
    });
    setIsLoading(false);
    return data.docs;
  };

  const getPost = async () => {
    setPost([]);
    const userIds = await getAllUsersDataFirestore();
    await Promise.allSettled(
      userIds.map(async cv => {
        return await getData(cv.id);
      }),
    );
  };

  const getAllUsersDataFirestore = async () => {
    try {
      const usersCollection = await firestore().collection('UsersData').get();
      usersCollection.forEach(documentSnapshot => {
        usersData.push({
          id: documentSnapshot.id,
          ...documentSnapshot.data(),
        });
      });
      return usersData;
    } catch (error) {
      showMessage({
        message: 'Error!!',
        description: 'There is some Error',
        type: 'danger',
      });
      return [error];
    }
  };
  useEffect(() => {
    getPost();
  }, [colorScheme]);

  const openDrawer = () => {
    navigation.openDrawer();
  };

  return (
    <View style={styles.mainLayout}>
      <View style={styles.sortStyle}>
        <View style={styles.userIcon}>
          <TouchableOpacity onPress={openDrawer} style={styles.userIcon}>
            {colorScheme === 'light' ? (
              <SettingMenu height={30} width={30} />
            ) : (
              <SettingMenuDark height={30} width={30} />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.logoView}>
          <Image
            style={styles.imageStyle}
            source={colorScheme === 'light' ? instadark : instalight}
          />
        </View>
        <View style={styles.actionBtn}>
          <View style={styles.heartStyle}>
            {colorScheme === 'light' ? (
              <HeartOutline height={25} width={25} />
            ) : (
              <HeartDark height={25} width={25} />
            )}
          </View>
          {colorScheme === 'light' ? (
            <Message />
          ) : (
            <MessageDark height={25} width={25} />
          )}
        </View>
      </View>
      {isloading ? (
        <ActivityIndicator size={'large'} />
      ) : (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={isrefreshing} onRefresh={onRefresh} />
          }
          data={post}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <PostComponent
              likes={item.like}
              title={item.title}
              comment={item.comment}
              date={item.dateAndTime}
              imagePost={item.postURL}
              description={item.description}
              imageUrl="https://images.pexels.com/photos/33106717/pexels-photo-33106717.jpeg?_gl=1*18doh69*_ga*MTk3NDc0NTgxMi4xNzQ3OTk4NTM2*_ga_8JE65Q40S6*czE3NTQzMDExMjMkbzMkZzEkdDE3NTQzMDEyMzEkajM3JGwwJGgw"
            />
          )}
        />
      )}
    </View>
  );
};

export default HomeScreen;

const homeScreenStyle = (colors: ColorProps) =>
  StyleSheet.create({
    imageStyle: { alignSelf: 'flex-end' },
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    mainLayout: {
      flex: 8,
      backgroundColor: colors.background,
    },
    sortStyle: {
      paddingTop: 30,
      elevation: 100,
      paddingBottom: 10,
      flexDirection: 'row',
      borderBottomWidth: 1,
      paddingHorizontal: 10,
      justifyContent: 'space-between',
      backgroundColor: colors.background,
      borderBottomColor: colors.modalBorderStyle,
    },
    userIcon: {
      marginBottom: '2%',
      alignSelf: 'flex-end',
    },
    userIconText: {
      fontSize: 27,
      fontWeight: '600',
      textAlign: 'center',
    },
    actionBtn: {
      padding: 10,
      flexDirection: 'row',
    },
    heartStyle: {
      marginHorizontal: 10,
    },
    logoView: {
      flex: 1,
      marginHorizontal: 10,
    },
  });
