import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import React, { Key, useEffect, useState } from 'react';

import firestore from '@react-native-firebase/firestore';

import {
  HeartDark,
  HeartOutline,
  Message,
  MessageDark,
  SettingMenu,
  SettingMenuDark,
} from '../helper/icon';
import PostComponent from '../components/PostComponent';
import { darkTheme } from '../theme/darkTheme';
import { lightTheme } from '../theme/lightTheme';
import { instadark, instalight } from '../helper/images';
import { colors } from '../hooks/useThemeColors';

interface Post {
  id: string;
  DateAndTime: string;
  Description: string;
  PostURL: Array<string>;
  Title: string;
  comment: number;
  like: number;
}

const HomeScreen = ({ navigation }: any) => {
  const [post, setPost] = useState<Post[]>([]);
  const usersData: any[] = [];
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  const onRefresh = () => {
    setRefreshing(true);
    getpost();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  const getData = async (id: string | undefined) => {
    const data = await firestore()
      .collection('UsersData')
      .doc(id)
      .collection('PostData')
      .get();

    data.docs.forEach(item => {
      post.includes(item.data() as Post)
        ? console.log('already post list there')
        : setPost(prevState => [...prevState, item.data() as Post]);

      console.log(post);
    });
    setLoading(false);

    return data.docs;
  };

  const getpost = async () => {
    setPost([]);
    const userIds = await getAllUsersDataFirestore();
    // console.log(userIds);
    await Promise.allSettled(
      userIds.map(async cv => {
        // console.log(cv);
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
      console.error('Error fetching users data from Firestore:', error);
      return [];
    }
  };
  useEffect(() => {
    getpost();
  }, [colorScheme]);

  const openDrawer = () => {
    navigation.openDrawer();
  };

  return (
    <View style={[styles.mainLAyout, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.sortstyle,
          {
            backgroundColor: colors.background,
            borderBottomColor: colors.modalBorderStyle,
          },
        ]}
      >
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
            style={{ alignSelf: 'flex-end' }}
            source={colorScheme === 'light' ? instadark : instalight}
          />
        </View>
        <View style={styles.actionbtn}>
          <View style={styles.heartstyle}>
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
      {loading ? (
        <ActivityIndicator size={'large'} />
      ) : (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={post}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <PostComponent
              comment={item.comment}
              likes={item.like}
              description={item.Description}
              title={item.Title}
              imagePost={item.PostURL}
              date={item.DateAndTime}
            />
          )}
        />
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainLAyout: {
    flex: 8,
  },
  sortstyle: {
    flexDirection: 'row',
    paddingTop: 30,
    paddingBottom: 10,
    paddingHorizontal: 10,
    justifyContent: 'space-between',

    borderBottomWidth: 1,

    elevation: 100,
  },
  userIcon: {
    marginBottom: '2%',
    alignSelf: 'flex-end',
  },
  userIcontext: {
    fontSize: 27,
    fontWeight: '600',
    textAlign: 'center',
  },
  actionbtn: {
    flexDirection: 'row',
    padding: 10,
  },
  heartstyle: {
    marginHorizontal: 10,
  },
  logoView: {
    flex: 1,
    marginHorizontal: 10,
  },
});
