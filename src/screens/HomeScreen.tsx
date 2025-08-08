import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';

import firestore from '@react-native-firebase/firestore';

import { HeartOutline, Message, SettingMenu } from '../helper/icon';
import PostComponent from '../components/PostComponent';
import { darkTheme } from '../theme/darkTheme';
import { lightTheme } from '../theme/lightTheme';
import { instadark, instalight } from '../helper/images';

interface Post {
  DateAndTime: string;
  Description: string;
  PostURL: Array<string>;
  Title: string;
  comment: number;
  like: number;
}

const HomeScreen = ({ navigation }: any) => {
  const [post, setPost] = useState<Post[]>([]);
  // const [userid, setUserId] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  // const id = currentUser?.uid.toString();
  // id && userid?.push(id);

  const getData = async (id: string | undefined) => {
    const data = await firestore()
      .collection('UsersData')
      .doc(id)
      .collection('PostData')
      .get();
    console.log(data.docs);

    data.docs.forEach(item => {
      console.log(item.data());
      post.includes(item.data() as Post)
        ? console.log('already post list there')
        : setPost(prevState => [...prevState, item.data() as Post]);
      console.log(post.includes(item.data() as Post));
      console.log(post);
    });
    return data.docs;
  };

  const getpost = async () => {
    const userIds = await getAllUsersDataFirestore();
    const PostData = await Promise.allSettled(
      userIds.map(async cv => {
        console.log(cv);
        return await getData(cv);
      }),
    );
  };

  const getAllUsersDataFirestore = async () => {
    try {
      const usersCollection = await firestore().collection('UsersData').get();
      const usersData: any[] = [];
      usersCollection.forEach(documentSnapshot => {
        usersData.push({
          id: documentSnapshot.id,
          ...documentSnapshot.data(),
        });
      });

      // usersData.map(cv => {
      //   userid.includes(cv.id) ? console.log('already') : userid.push(cv.id);
      // });
      // getpost();
      return usersData;
    } catch (error) {
      console.error('Error fetching users data from Firestore:', error);
      return [];
    }
  };
  useEffect(() => {
    getAllUsersDataFirestore();

    setLoading(false);
  }, []);

  const openDrawer = () => {
    navigation.openDrawer();
  };

  return (
    <View style={styles.mainLAyout}>
      <View style={styles.sortstyle}>
        <View style={styles.userIcon}>
          <TouchableOpacity onPress={openDrawer} style={styles.userIcon}>
            <SettingMenu height={30} width={30} />
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
            <HeartOutline height={25} width={25} />
          </View>
          <Message />
        </View>
      </View>
      {loading ? (
        <ActivityIndicator size={'large'} />
      ) : (
        <FlatList
          data={post}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <PostComponent
              comment={item.comment}
              likes={item.like}
              description={item.Description}
              title={item.Title}
              ImagePost={item.PostURL}
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
    backgroundColor: '#FFFFFF',
    flex: 8,
  },
  sortstyle: {
    flexDirection: 'row',
    paddingTop: 30,
    paddingBottom: 10,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#D9D9D9',
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
