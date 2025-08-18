import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import { colors } from '../hooks/useThemeColors';
import { useNavigation } from '@react-navigation/native';
import { SettingMenu, SettingMenuDark } from '../helper/icon';
import ProfileTopComponent from '../components/ProfileTopComponent';
import ProfileBottomComponent from '../components/ProfileBottomComponent';

interface Post {
  id: string;
  DateAndTime: string;
  Description: string;
  PostURL: Array<string>;
  Title: string;
  comment: number;
  like: number;
  following: number;
  followers: number;
}
interface User {
  id: string;
  DOB: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  mobileNo: string;
  imageUrl: string;
  followers: number;
  following: number;
}

const ProfileScreen = () => {
  const [post, setPost] = useState<Post[]>([]);
  const [usersData, setUserData] = useState<User>();

  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<any>();
  const colorScheme = useColorScheme();
  const currentUser = auth().currentUser;

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
    });

    setLoading(false);

    return data.docs;
  };

  useEffect(() => {
    setPost([]);
    console.log(usersData);
    getData(usersData?.id);
  }, [usersData]);

  const getpost = async () => {
    setPost([]);
    await getAllUsersDataFirestore();
    console.log('k.asdfglasbdfgkjabskldfgabklsjb');
  };

  const getAllUsersDataFirestore = async () => {
    try {
      const usersCollection = await firestore()
        .collection('UsersData')
        .where('email', '==', currentUser?.email)
        .get();
      console.log(
        '🚀 ~ getAllUsersDataFirestore ~ usersCollection:',
        usersCollection.docs[0].id,
      );
      console.log(
        '🚀 ~ getAllUsersDataFirestore ~ usersCollection:',
        usersCollection.docs[0].data().firstName,
      );
      const documentSnapshot = usersCollection.docs[0];

      console.log(
        '🚀 ~ getAllUsersDataFirestore ~ documentSnapshot:',
        documentSnapshot.id,
        '\n' + documentSnapshot.data().firstName,
        documentSnapshot.data().DOB,
        documentSnapshot.data().email,
        documentSnapshot.data().lastName,
        documentSnapshot.data().gender,
        documentSnapshot.data().mobileNo,
        documentSnapshot.data().userImage,
        documentSnapshot.data().Followers,
        documentSnapshot.data().Following,
      );
      setUserData({
        id: documentSnapshot.id,
        firstName: documentSnapshot.data().firstName,
        DOB: documentSnapshot.data().DOB,
        email: documentSnapshot.data().email,
        lastName: documentSnapshot.data().lastName,
        gender: documentSnapshot.data().gender,
        mobileNo: documentSnapshot.data().mobileNo,
        imageUrl: documentSnapshot.data().userImage,
        followers: documentSnapshot.data().Followers,
        following: documentSnapshot.data().Following,
      });

      return usersData;
    } catch (error) {
      return [];
    }
  };
  useEffect(() => {
    getpost();
  }, []);

  const openDrawer = () => {
    navigation.openDrawer();
  };
  return (
    <View
      style={[styles.mainLAyout, { backgroundColor: colors.profileBackground }]}
    >
      <View
        style={[
          styles.sortstyle,
          {
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
      </View>
      {loading ? (
        <ActivityIndicator
          style={{ flex: 1, justifyContent: 'center' }}
          color={'#ff2820'}
          size={'large'}
        />
      ) : (
        <>
          {!!usersData && (
            <View style={{ flex: 0.5 }}>
              <ProfileTopComponent
                follower={usersData.followers}
                following={usersData.following}
                totalPost={post.length}
                userName={usersData.firstName + ' ' + usersData.lastName}
                ProfilePhoto={usersData.imageUrl}
              />
            </View>
          )}
        </>
      )}

      {loading ? (
        <ActivityIndicator
          style={{ flex: 1, justifyContent: 'center' }}
          color={'#ff2820'}
          size={'large'}
        />
      ) : (
        <View style={{ flex: 1.2 }}>
          <FlatList
            showsVerticalScrollIndicator={false}
            horizontal={false}
            numColumns={3}
            data={post}
            renderItem={({ item }) => (
              <ProfileBottomComponent image={item.PostURL} />
            )}
            keyExtractor={item => item.id}
          />
        </View>
      )}
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  mainLAyout: {
    flex: 1,
    justifyContent: 'space-between',
  },
  sortstyle: {
    flexDirection: 'row-reverse',
    paddingTop: 30,
    // paddingBottom: 10,
    paddingHorizontal: 10,
    justifyContent: 'space-between',

    // borderBottom/Width: 1,

    //    elevation: 1,
  },
  userIcon: {
    marginBottom: '2%',
    alignSelf: 'flex-end',
  },
  logoView: {
    flex: 1,
    marginHorizontal: 10,
  },
  actionbtn: {
    flexDirection: 'row',
    padding: 10,
  },
  heartstyle: {
    marginHorizontal: 10,
  },
});
