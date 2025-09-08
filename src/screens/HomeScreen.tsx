import React, { useEffect, useState } from 'react';
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

import { t } from 'i18next';
import auth from '@react-native-firebase/auth';
import { showMessage } from 'react-native-flash-message';
import firestore from '@react-native-firebase/firestore';

import {
  Message,
  HeartDark,
  MessageDark,
  SettingMenu,
  HeartOutline,
  SettingMenuDark,
} from '../helper/icon';
import { ColorProps } from '../constants/color';
import PostComponent from '../components/PostComponent';
import { instadark, instalight } from '../helper/images';
import { useThemeColors } from '../hooks/useThemeColors';
import { LanguageConstant } from '../constants/language_constants';

interface Post {
  name: string;
  userImage: string;
  id: string;
  like: number;
  title: string;
  comment: number;
  dateAndTime: string;
  description: string;
  postURL: Array<string>;
}

interface userData {
  id: string;
  userName: string;
  userImage: string;
}

const HomeScreen = ({ navigation }: any) => {
  const [post, setPost] = useState<Post[]>([]);

  const [isloading, setIsLoading] = useState(true);
  const [isrefreshing, setIsRefreshing] = useState(false);

  const colorScheme = useColorScheme() == 'light';
  const colors = useThemeColors();
  const styles = homeScreenStyle(colors);

  const currentUser = auth().currentUser;

  const userId = currentUser ? currentUser.uid : '';

  const onRefresh = () => {
    setIsRefreshing(true);
    getPost();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };
  const getData = async (id: string, name: string, userImage: string) => {
    const data = await firestore()
      .collection('UsersData')
      .doc(id)
      .collection('PostData')
      .get();

    data.docs.forEach(item => {
      setPost(prevState => [
        ...prevState,
        { name: name, userImage: userImage, ...item.data() } as Post,
      ]);
    });
    setIsLoading(false);
    return data.docs;
  };

  const getPost = async () => {
    setPost([]);
    try {
      const userIds: userData[] | undefined = await getAllUsersDataFirestore();
      await Promise.allSettled(
        (userIds ?? []).map(async (cv: userData) => {
          return await getData(cv.id, cv.userName, cv.userImage);
        }),
      );
    } catch (error) {
      console.error('Failed to fetch user IDs:', error);
      showMessage({
        message: t(LanguageConstant.error),
        description: `${t(LanguageConstant.error_message)} `,
        type: 'danger',
      });
    }
  };

  const getAllUsersDataFirestore = async () => {
    try {
      const usersCollection = await firestore()
        .collection('UsersData')
        .doc(userId)
        .get();
      const followingCollection = await firestore()
        .collection('UsersData')
        .get();

      const filteredUsers: userData[] = followingCollection.docs
        .filter(ele => usersCollection.data()?.following?.includes(ele.id))
        .map(ele => ({
          id: ele.id,
          userName: ele.data().firstName + ' ' + ele.data().lastName,
          userImage: ele.data().userImage,
        }));

      return filteredUsers;
    } catch (error) {
      showMessage({
        message: t(LanguageConstant.error),
        description: `${t(LanguageConstant.error_message)} `,
        type: 'danger',
      });
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
            {colorScheme ? (
              <SettingMenu height={30} width={30} />
            ) : (
              <SettingMenuDark height={30} width={30} />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.logoView}>
          <Image
            style={styles.imageStyle}
            source={colorScheme ? instadark : instalight}
          />
        </View>
        <View style={styles.actionBtn}>
          <View style={styles.heartStyle}>
            {colorScheme ? (
              <HeartOutline height={25} width={25} />
            ) : (
              <HeartDark height={25} width={25} />
            )}
          </View>
          {colorScheme ? <Message /> : <MessageDark height={25} width={25} />}
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
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <PostComponent
              likes={item.like}
              title={item.title}
              comment={item.comment}
              date={item.dateAndTime}
              imagePost={item.postURL}
              description={item.description}
              userName={item.name}
              imageUrl={item.userImage}
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
