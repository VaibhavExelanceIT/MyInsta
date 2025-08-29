import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';

import { SettingMenu, SettingMenuDark } from '../helper/icon';
import ProfileTopComponent from '../components/ProfileTopComponent';
import ProfilePostItem from '../components/ProfilePostItem';
import { useThemeColors } from '../hooks/useThemeColors';
import { ColorProps } from '../constants/color';

interface Post {
  id: string;
  like: number;
  title: string;
  comment: number;
  following: number;
  followers: number;
  dateAndTime: string;
  description: string;
  postURL: Array<string>;
}
interface User {
  id: string;
  DOB: string;
  email: string;
  gender: string;
  lastName: string;
  mobileNo: string;
  imageUrl: string;
  firstName: string;
  followers: Array<string>;
  following: Array<string>;
}

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState<Post[]>([]);
  const [usersData, setUserData] = useState<User>();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const currentUser = auth().currentUser;
  const colors = useThemeColors();
  const styles = profileScreenStyle(colors);

  const getPostData = async (id: string) => {
    try {
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
    } catch (error) {
      showMessage({
        message: 'Error ',
        description: `There is some Error ${error}`,
        type: 'danger',
      });
    }
  };
  const onRefresh = async () => {
    setIsRefreshing(true);
    userData();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const userData = async () => {
    return await getAllUsersDataFirestore();
  };
  useEffect(() => {
    userData();
  }, []);

  useEffect(() => {
    setPost([]);
    const getData = async (id: string) => {
      usersData?.id ? await getPostData(id) : '';
    };
    usersData?.id ? getData(usersData?.id) : '';
  }, [usersData]);

  const getAllUsersDataFirestore = async () => {
    try {
      const usersCollection = await firestore()
        .collection('UsersData')
        .where('email', '==', currentUser?.email)
        .get();

      const documentSnapshot = usersCollection.docs[0].data();
      const data: User = {
        DOB: documentSnapshot.DOB,
        email: documentSnapshot.email,
        id: usersCollection.docs[0].id,
        gender: documentSnapshot.gender,
        mobileNo: documentSnapshot.mobileNo,
        lastName: documentSnapshot.lastName,
        imageUrl: documentSnapshot.userImage,
        followers: documentSnapshot.follower,
        following: documentSnapshot.following,
        firstName: documentSnapshot.firstName,
      };
      setUserData(data);

      return usersData;
    } catch (error) {
      return [];
    }
  };

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
      </View>
      {isLoading ? (
        <ActivityIndicator
          style={styles.loaderStyle}
          color={colors.activityIndicatorStyle}
          size={'large'}
        />
      ) : (
        <>
          {!!usersData && (
            <View style={{ flex: 0.5 }}>
              <ProfileTopComponent
                totalPost={post.length}
                ProfilePhoto={usersData.imageUrl}
                follower={usersData.followers.length}
                following={usersData.following.length}
                userName={usersData.firstName + ' ' + usersData.lastName}
              />
            </View>
          )}
        </>
      )}

      {isLoading ? (
        <ActivityIndicator
          style={styles.loaderStyle}
          color={colors.activityIndicatorStyle}
          size={'large'}
        />
      ) : post.length > 0 ? (
        <View style={styles.postStyle}>
          <FlatList
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            data={post}
            numColumns={3}
            horizontal={false}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <ProfilePostItem image={item.postURL} />}
            keyExtractor={item => item.id}
          />
        </View>
      ) : (
        <View style={styles.postStyle}>
          <Text style={styles.textStyle}>No Post</Text>
        </View>
      )}
    </View>
  );
};

export default ProfileScreen;

const profileScreenStyle = (colors: ColorProps) =>
  StyleSheet.create({
    postStyle: { flex: 1.2 },
    loaderStyle: { flex: 1, justifyContent: 'center' },
    textStyle: {
      flex: 1,
      fontSize: 20,
      fontWeight: '400',
      textAlign: 'center',
      textAlignVertical: 'center',
    },
    mainLayout: {
      flex: 1,
      justifyContent: 'space-between',
      backgroundColor: colors.profileBackground,
    },
    sortStyle: {
      paddingTop: 30,
      paddingHorizontal: 10,
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
      borderBottomColor: colors.modalBorderStyle,
    },
    userIcon: {
      marginBottom: '2%',
      alignSelf: 'flex-end',
    },
  });
