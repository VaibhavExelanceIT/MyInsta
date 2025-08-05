import {
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { HeartOutline, Message } from '../helper/icon';
import PostComponent from '../components/PostComponent';
import auth from '@react-native-firebase/auth';
import { darkTheme } from '../theme/darkTheme';
import { lightTheme } from '../theme/lightTheme';
import { instadark, instalight } from '../helper/images';

interface Post {
  DateAndTime: string;
  Description: string;
  PostUrl: Array<string>;
  Title: string;
  comment: string;
  like: string;
}

const HomeScreen = ({ route, navigation }: any) => {
  const [uri, setUri] = useState<string>();
  const [post, setPost] = useState<Array<Post>>();
  const currentUser = auth().currentUser;
  const useremail = currentUser?.email;

  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const userid = currentUser?.uid;

  const getData = async () => {
    const users = await firestore().collection('UsersData').get();

    let length = users.docs.length;
    for (let index = 0; index < length; index++) {
      const element = users.docs[index].data();

      setUri(element.userImage);
      console.log('🚀 ~ getData ~ userimage:', uri);
    }
  };
  const getpost = async () => {
    const PostData = await firestore()
      .collection('UsersData')
      .doc(userid)
      .collection('PostData')
      .get();
    console.log(PostData);

    let length = PostData.docs.length;
    for (let index = 0; index < length; index++) {
      const element = PostData.docs[index].data();
      console.log(element);
      const postsArray: Post[] = PostData.docs.map(doc => doc.data() as Post);
      setPost(postsArray);
      console.log(post);
    }
  };
  useEffect(() => {
    getpost();
    getData();
  }, []);

  return (
    <View style={styles.mainLAyout}>
      <View style={styles.sortstyle}>
        <View style={styles.userIcon}>
          <Image
            style={{ height: 45, width: 45, borderRadius: 50 }}
            src={uri}
          />
        </View>
        <View style={styles.logoView}>
          <Image
            style={{ flex: 1, alignSelf: 'flex-end' }}
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
      <FlatList
        data={post}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <PostComponent
            comment={item.comment}
            likes={item.like}
            description={item.Description}
            title={item.Title}
            ImagePost={item.PostUrl}
            date={item.DateAndTime}
          />
        )}
      />

      <Image src={uri} height={200} width={420} />
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
    marginBottom: 10,
    width: 40,
    height: 40,
    borderRadius: 30,
    alignSelf: 'flex-end',

    backgroundColor: '#D9D9D9',
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
