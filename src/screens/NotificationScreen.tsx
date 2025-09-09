import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { t } from 'i18next';

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
import { useTheme } from '../hooks/useTheme';
import { LanguageConstant } from '../constants/language_constants';
import { fs } from '../helper/fontSize';

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

  const { isDarkMode } = useTheme();
  const currentUser = auth().currentUser;
  const userId: string = currentUser?.uid ? currentUser?.uid : '';

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
    <SafeAreaView style={styles.mainLayout} edges={['top', 'left', 'right']}>
      <View style={styles.sortStyle}>
        <View style={styles.userIcon}>
          <TouchableOpacity onPress={openDrawer} style={styles.userIcon}>
            {isDarkMode ? (
              <SettingMenuDark height={30} width={30} />
            ) : (
              <SettingMenu height={30} width={30} />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.logoView}>
          <Image
            style={styles.imageStyle}
            source={isDarkMode ? instalight : instadark}
          />
        </View>
        <View style={styles.actionBtn}>
          <View style={styles.heartStyle}>
            {isDarkMode ? (
              <HeartDark height={25} width={25} />
            ) : (
              <HeartOutline height={25} width={25} />
            )}
          </View>
          {isDarkMode ? <MessageDark height={25} width={25} /> : <Message />}
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator style={styles.loaderStyle} size={'large'} />
      ) : usersRequestData.length > 0 ? (
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
      ) : (
        <View style={styles.txtViewStyle}>
          <Text style={styles.textStyle}>{t(LanguageConstant.noPostTxt)}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default NotificationScreen;

const notificationScreenStyle = (colors: ColorProps) =>
  StyleSheet.create({
    loaderStyle: { flex: 1, justifyContent: 'center' },
    mainLayout: { flex: 1, backgroundColor: colors.background },
    userIcon: {
      marginBottom: '2%',
      alignSelf: 'flex-end',
    },
    sortStyle: {
      paddingTop: 10,
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
    txtViewStyle: {
      flex: 1,
      justifyContent: 'center',
      alignSelf: 'center',
    },
    textStyle: {
      fontSize: fs(16),
      color: colors.text,
    },
  });
