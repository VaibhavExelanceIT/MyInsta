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

// import { t } from 'i18next';/
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';

import { fs } from '../helper/fontSize';
import { useTheme } from '../hooks/useTheme';
import { ColorProps } from '../constants/color';
import { instadark, instalight } from '../helper/images';
import { useThemeColors } from '../hooks/useThemeColors';
import { getText } from '../constants/language/i18next';
import { SettingMenu, SettingMenuDark } from '../helper/icon';
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

  const { isDarkMode } = useTheme();
  const currentUser = auth().currentUser;
  const userId: string = currentUser?.uid ? currentUser?.uid : '';

  const colors = useThemeColors();
  const styles = notificationScreenStyle(colors);

  useEffect(() => {
    // Reset
    setUserData([]);

    // Subscribe to both listeners once
    const unsubscribeUsers = getAllUsersDataFirestore();
    const unsubscribeRequest: any = getRequestCome();

    // Clean up listeners when component unmounts
    return () => {
      unsubscribeUsers && unsubscribeUsers();
      unsubscribeRequest && unsubscribeRequest();
    };
  }, []);

  const onRefresh = () => {
    setUserData([]);
    setIsLoading(true);
    setIsRefreshing(true);

    firestore()
      .collection('UsersData')
      .get()
      .then(snapshot => {
        const fetchedUsers: userData[] = [];
        snapshot.forEach(doc => {
          fetchedUsers.push({ ...doc.data(), id: doc.id } as userData);
        });
        setUserData(fetchedUsers);
        setIsLoading(false);
        setIsRefreshing(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
        setIsRefreshing(false);
      });
  };

  const getAllUsersDataFirestore = () => {
    try {
      setUserData([]);
      const fetchedUsers: userData[] = [];
      const unsubscribe = firestore()
        .collection('UsersData')
        .onSnapshot(documentSnapshot => {
          documentSnapshot.forEach(doc => {
            console.log('inside the forEach');
            console.log(doc.data());

            fetchedUsers.push({ ...doc.data(), id: doc.id } as userData);
          });
          setIsLoading(false);
          setIsRefreshing(false);
          setUserData(fetchedUsers);
          console.log(
            '🚀 ~ getAllUsersDataFirestore ~ fetchedUsers:',
            fetchedUsers,
          );
        });
      return unsubscribe;
    } catch (error) {
      setIsLoading(false);
    }
  };

  const getRequestCome = () => {
    try {
      setUserData([]);
      const unsubscribe = firestore()
        .collection('UsersData')
        .doc(userId)
        .onSnapshot(documentSnapshot => {
          console.log(
            '🚀 ~ getRequestCome ~ documentSnapshot:',
            documentSnapshot,
          );
          if (documentSnapshot.exists()) {
            const data = documentSnapshot.data();
            console.log('🚀 ~ getRequestCome ~ data:', data);

            setUserRequestData(data?.requestCome);
          } else {
            return null;
          }

          setIsLoading(false);
          setIsRefreshing(false);
        });
      return unsubscribe;
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
                  userId={item.id}
                  currentUserId={userId}
                  imageUrl={item.userImage}
                  userName={item.firstName}
                  isRequested={item.requestCome.includes(userId)}
                />
              )}
            </View>
          )}
        />
      ) : (
        <View style={styles.txtViewStyle}>
          <Text style={styles.textStyle}>{getText('noNotification')}</Text>
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
    imageStyle: { alignSelf: 'center' },

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
