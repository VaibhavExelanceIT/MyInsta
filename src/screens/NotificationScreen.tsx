import React, { useEffect, useState } from 'react';

import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  useColorScheme,
  TouchableOpacity,
  Image,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import { useThemeColors } from '../hooks/useThemeColors';
import { ColorProps } from '../constants/color';
import {
  HeartDark,
  HeartOutline,
  Message,
  MessageDark,
  SettingMenu,
  SettingMenuDark,
} from '../helper/icon';
import { instadark, instalight } from '../helper/images';
import UserRequestListComponent from '../components/UserRequestListComponent';

interface userData {
  id: string;
  DOB: string;
  email: string;
  gender: string;
  lastName: string;
  mobileNo: string;
  firstName: string;
  userImage: string;
  follower: Array<string>;
  following: Array<string>;
  requestCome: Array<string>;
  requestSent: Array<string>;
}

const NotificationScreen = ({ navigation }: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [usersData, setUserData] = useState<userData[]>([]);
  const [usersRequestData, setUserRequestData] = useState<string[]>([]);

  const currentUser = auth().currentUser;
  const userId: string = currentUser?.uid ? currentUser?.uid : '';

  const colorScheme = useColorScheme() === 'light';
  const colors = useThemeColors();

  const styles = notificationScreenStyle(colors);

  useEffect(() => {
    setUserData([]);
    getAllUsersDataFirestore();
    getRequestCome();
  }, []);

  const onRefresh = () => {
    setIsLoading(true);
    setIsRefreshing(true);
    getAllUsersDataFirestore();
    getRequestCome();
  };

  const getAllUsersDataFirestore = async () => {
    try {
      const fetchedUsers: userData[] = [];
      const usersCollection = await firestore().collection('UsersData').get();

      usersCollection.forEach(documentSnapshot => {
        const data = documentSnapshot.data();
        fetchedUsers.push({
          ...data,
          id: documentSnapshot.id,
        } as userData);
      });
      setIsLoading(false);
      setIsRefreshing(false);
      setUserData(fetchedUsers);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const getRequestCome = async () => {
    try {
      const usersCollection = await firestore()
        .collection('UsersData')
        .doc(userId)
        .get();

      if (usersCollection.exists()) {
        const data = usersCollection.data();

        setUserRequestData(data?.requestCome);
      } else {
        return null;
      }

      setIsLoading(false);
      setIsRefreshing(false);

      return usersRequestData;
    } catch (error) {
      setIsLoading(false);
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

      {isLoading ? (
        <ActivityIndicator style={styles.loaderStyle} size={'large'} />
      ) : (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          data={usersData}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View>
              {usersRequestData.includes(item.id) && (
                <UserRequestListComponent
                  isRequested={item.requestCome.includes(userId)}
                  userId={item.id}
                  currentUserId={userId}
                  imageUrl={item.userImage}
                  userName={item.firstName}
                />
              )}
            </View>
          )}
        />
      )}
    </View>
  );
};

export default NotificationScreen;

const notificationScreenStyle = (colors: ColorProps) =>
  StyleSheet.create({
    loaderStyle: { flex: 1, justifyContent: 'center' },
    mainLayout: { flex: 1 },
    userIcon: {
      marginBottom: '2%',
      alignSelf: 'flex-end',
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
    logoView: {
      flex: 1,
      marginHorizontal: 10,
    },
    imageStyle: { alignSelf: 'flex-end' },
    actionBtn: {
      padding: 10,
      flexDirection: 'row',
    },
    heartStyle: {
      marginHorizontal: 10,
    },
  });
