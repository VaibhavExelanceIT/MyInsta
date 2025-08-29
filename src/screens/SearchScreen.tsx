import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import UserListComponent from '../components/UserListComponent';
import { useThemeColors } from '../hooks/useThemeColors';
import { ColorProps } from '../constants/color';

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
}

const SearchScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [usersData, setUserData] = useState<userData[]>([]);

  const currentUser = auth().currentUser;
  const userId: string = currentUser?.uid ? currentUser?.uid : '';

  const colors = useThemeColors();
  const styles = searchScreenStyle(colors);
  const onRefresh = () => {
    setIsLoading(true);
    setIsRefreshing(true);
    getAllUsersDataFirestore();
  };

  const getAllUsersDataFirestore = async () => {
    try {
      const fetchedUsers: userData[] = [];
      const usersCollection = await firestore().collection('UsersData').get();

      usersCollection.forEach(documentSnapshot => {
        const data = documentSnapshot.data();
        fetchedUsers.push({
          id: documentSnapshot.id,
          DOB: data.DOB,
          email: data.email,
          gender: data.gender,
          lastName: data.lastName,
          mobileNo: data.mobileNo,
          follower: data.follower,
          firstName: data.firstName,
          following: data.following,
          userImage: data.userImage,
        });
      });
      setIsLoading(false);
      setIsRefreshing(false);
      setUserData(fetchedUsers);
      return usersData;
    } catch (error) {
      setIsLoading(false);
      return [];
    }
  };
  useEffect(() => {
    setUserData([]);
    getAllUsersDataFirestore();
  }, []);

  return (
    <View style={styles.mainLayout}>
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
              <UserListComponent
                isFollowed={item.follower.includes(userId)}
                userId={item.id}
                currentUserId={userId}
                imageUrl={item.userImage}
                userName={item.firstName}
              />
            </View>
          )}
        />
      )}
    </View>
  );
};

export default SearchScreen;

const searchScreenStyle = (colors: ColorProps) =>
  StyleSheet.create({
    loaderStyle: { flex: 1, justifyContent: 'center' },
    mainLayout: { flex: 1, paddingVertical: 20 },
  });
