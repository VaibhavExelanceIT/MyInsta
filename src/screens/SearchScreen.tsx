import React, { useMemo, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  useColorScheme,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';

import { t } from 'i18next';
import { Searchbar } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import UserListComponent from '../components/UserListComponent';
import { useThemeColors } from '../hooks/useThemeColors';
import { ColorProps } from '../constants/color';

import {
  CrossDark,
  CrossLight,
  HeartDark,
  HeartOutline,
  Message,
  MessageDark,
  SearchFill,
  SearchFillDark,
  SettingMenu,
  SettingMenuDark,
} from '../helper/icon';
import { instadark, instalight } from '../helper/images';
import { LanguageConstant } from '../constants/language_constants';
import { fs } from '../helper/fontSize';

interface userData {
  id: string;
  lastName: string;
  firstName: string;
  userImage: string;
  follower: Array<string>;
  requestCome: Array<string>;
}

const SearchScreen = ({ navigation }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [usersData, setUserData] = useState<userData[]>([]);

  const colors = useThemeColors();
  const colorScheme = useColorScheme();
  const currentUser = auth().currentUser;
  const styles = searchScreenStyle(colors);

  const userId: string = currentUser?.uid ? currentUser?.uid : '';

  const onRefresh = () => {
    setIsLoading(true);
    setIsRefreshing(true);
    dSearch(searchQuery);
  };

  const openDrawer = () => {
    navigation.openDrawer();
  };

  function debounce(func: any, delay: number) {
    let timeout: number | NodeJS.Timeout;
    return (...args: any) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func(...args);
      }, delay);
    };
  }

  const userSearch = async (query: string) => {
    try {
      setUserData([]);

      const usersRef = firestore().collection('UsersData');
      let firstNameUsers;
      let lastNameUsers;

      if (query.trim() != '') {
        const firstNameQuery = usersRef
          .orderBy('firstName')
          .startAt(query)
          .endAt(query + '\uf8ff')
          .get();

        const lastNameQuery = usersRef
          .orderBy('lastName')
          .startAt(query)
          .endAt(query + '\uf8ff')
          .get();
        [firstNameUsers, lastNameUsers] = await Promise.all([
          firstNameQuery,
          lastNameQuery,
        ]);

        const userMap = new Map();

        firstNameUsers.forEach(documentSnapshot => {
          const data = documentSnapshot.data();
          userMap.set(documentSnapshot.id, {
            id: documentSnapshot.id,
            lastName: data.lastName,
            follower: data.follower,
            firstName: data.firstName,
            userImage: data.userImage,
            requestCome: data.requestCome,
          });
        });

        lastNameUsers.forEach(documentSnapshot => {
          const data = documentSnapshot.data();
          userMap.set(documentSnapshot.id, {
            id: documentSnapshot.id,
            lastName: data.lastName,
            follower: data.follower,
            firstName: data.firstName,
            userImage: data.userImage,
            requestCome: data.requestCome,
          });
        });

        const allUsers = Array.from(userMap.values());
        const data = allUsers.filter(cv => cv.id !== userId);
        setUserData(data);
        setIsLoading(false);
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
        setIsRefreshing(false);
        setUserData([]);
      }
    } catch (error) {
      setIsLoading(false);
      return [];
    }
  };

  const handleSearch = (text: string) => {
    if (text.trim() == '') {
      setUserData([]);
      setIsLoading(false);
      return;
    }
    dSearch(text);
  };

  const dSearch = useMemo(() => debounce(userSearch, 1000), []);

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
      <View style={styles.searchBarStyle}>
        <Searchbar
          mode="bar"
          inputStyle={{ color: colors.text }}
          placeholder={t(LanguageConstant.search)}
          onChangeText={e => {
            handleSearch(e);
            setSearchQuery(e);
          }}
          rippleColor={colors.text}
          value={searchQuery}
          style={styles.searchStyle}
          placeholderTextColor={colors.text}
          elevation={2}
          icon={({ size, color }) =>
            colorScheme == 'light' ? (
              <SearchFill width={size} height={size} fill={color} />
            ) : (
              <SearchFillDark width={size} height={size} fill={color} />
            )
          }
          clearIcon={({ size, color }) =>
            colorScheme == 'light' ? (
              <CrossDark width={size} height={size} fill={color} />
            ) : (
              <CrossLight width={size} height={size} fill={color} />
            )
          }
          onClearIconPress={() => setSearchQuery('')}
        />
      </View>
      {isLoading ? (
        <ActivityIndicator style={styles.loaderStyle} size={'large'} />
      ) : usersData.length > 0 ? (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          data={usersData}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View>
              <UserListComponent
                isFollowed={item.follower.includes(userId)}
                isRequested={item.requestCome.includes(userId)}
                userId={item.id}
                currentUserId={userId}
                imageUrl={item.userImage}
                firstName={item.firstName}
                lastName={item.lastName}
              />
            </View>
          )}
        />
      ) : (
        <View style={styles.txtViewStyle}>
          <Text style={styles.textStyle}>{t(LanguageConstant.noPostTxt)}</Text>
        </View>
      )}
    </View>
  );
};

export default SearchScreen;

const searchScreenStyle = (colors: ColorProps) =>
  StyleSheet.create({
    loaderStyle: { flex: 1, justifyContent: 'center' },
    mainLayout: { flex: 1 },
    searchStyle: {
      color: colors.white,
      backgroundColor: colors.listBackgroundColor,
      borderRadius: 30,
    },
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
    searchBarStyle: { padding: 10 },
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
