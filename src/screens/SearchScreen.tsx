import React, { useEffect, useMemo, useState } from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { Searchbar } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import { showMessage } from 'react-native-flash-message';
import firestore from '@react-native-firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  CrossDark,
  CrossLight,
  SearchFill,
  SettingMenu,
  SearchFillDark,
  SettingMenuDark,
} from '../helper/icon';
import { fs } from '../helper/fontSize';
import { useTheme } from '../hooks/useTheme';
import { ColorProps } from '../constants/color';
import { getText } from '../constants/language/i18next';
import { instadark, instalight } from '../helper/images';
import { useThemeColors } from '../hooks/useThemeColors';
import UserListComponent from '../components/UserListComponent';

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
  const [allUserData, setAllUserData] = useState<userData[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const colors = useThemeColors();

  const { isDarkMode } = useTheme();

  const currentUser = auth().currentUser;
  const styles = searchScreenStyle(colors);

  const userId: string = currentUser?.uid ? currentUser?.uid : '';

  const handleActionComplete = () => {
    dSearch(searchQuery);
  };
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
      let firstNameUsers;
      let lastNameUsers;
      setUserData([]);
      const usersRef = firestore().collection('UsersData');

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
        setHasSearched(true);
      } else {
        setIsLoading(false);
        setIsRefreshing(false);
        setUserData([]);
        setHasSearched(false);
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

  const Userdata = () => {
    try {
      const unsubscribe = firestore()
        .collection('UsersData')
        .onSnapshot(snapshot => {
          const users: userData[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })) as userData[];

          setAllUserData(users);
          setIsLoading(false);
        });

      return () => unsubscribe();
    } catch (error) {
      showMessage({
        message: getText('error'),
        description: getText('error_message'),
        type: 'danger',
      });
    }
  };

  useEffect(() => {
    Userdata();
  }, []);

  return (
    <SafeAreaView style={styles.mainLayout} edges={['top', 'left', 'right']}>
      <View style={styles.sortStyle}>
        <View style={styles.settingIcon}>
          <TouchableOpacity onPress={openDrawer} style={styles.settingIcon}>
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
      <View style={styles.searchBarStyle}>
        <Searchbar
          mode="bar"
          inputStyle={styles.searchBarInputStyle}
          placeholder={getText('search')}
          onChangeText={e => {
            setIsLoading(true);
            handleSearch(e);
            setSearchQuery(e);
          }}
          rippleColor={colors.text}
          value={searchQuery}
          style={styles.searchStyle}
          placeholderTextColor={colors.text}
          elevation={2}
          icon={({ size, color }) =>
            isDarkMode ? (
              <SearchFillDark width={size} height={size} fill={color} />
            ) : (
              <SearchFill width={size} height={size} fill={color} />
            )
          }
          clearIcon={({ size, color }) =>
            isDarkMode ? (
              <CrossLight width={size} height={size} fill={color} />
            ) : (
              <CrossDark width={size} height={size} fill={color} />
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
                onActionComplete={handleActionComplete}
              />
            </View>
          )}
        />
      ) : hasSearched ? (
        <View style={styles.txtViewStyle}>
          <Text style={styles.suggestedViewStyle}>
            {getText('noUserFound')}
          </Text>
        </View>
      ) : (
        <View style={styles.txtViewStyle}>
          <Text style={styles.suggestedViewStyle}>
            {getText('suggestAccount')}
          </Text>
          <FlatList
            data={allUserData}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              return (
                <View>
                  <UserListComponent
                    isFollowed={item.follower.includes(userId)}
                    isRequested={item.requestCome.includes(userId)}
                    userId={item.id}
                    currentUserId={userId}
                    imageUrl={item.userImage}
                    firstName={item.firstName}
                    lastName={item.lastName}
                    onActionComplete={handleActionComplete}
                  />
                </View>
              );
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;

const searchScreenStyle = (colors: ColorProps) =>
  StyleSheet.create({
    suggestedViewStyle: {
      fontSize: fs(14),
      fontWeight: '600',
      color: colors.text,
      marginVertical: 10,
      marginHorizontal: 20,
    },
    searchBarInputStyle: { color: colors.text },
    loaderStyle: { flex: 1, justifyContent: 'center' },
    mainLayout: { flex: 1, backgroundColor: colors.background },
    searchStyle: {
      borderRadius: 30,
      color: colors.white,
      backgroundColor: colors.listBackgroundColor,
    },
    settingIcon: {
      marginBottom: '2%',
      alignSelf: 'flex-end',
    },
    sortStyle: {
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
      marginTop: 10,
      marginHorizontal: 10,
    },
    imageStyle: { alignSelf: 'center' },
    actionBtn: {
      padding: 10,
      marginTop: 10,
      flexDirection: 'row',
    },

    searchBarStyle: { padding: 10 },
    txtViewStyle: {
      flex: 1,
      borderRadius: 10,
      marginHorizontal: 5,
      backgroundColor: colors.background,
    },
    textStyle: {
      fontSize: fs(16),
      color: colors.text,
    },
  });
