import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';

import auth from '@react-native-firebase/auth';
import { showMessage } from 'react-native-flash-message';
import firestore from '@react-native-firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../hooks/useTheme';
import { ColorProps } from '../constants/color';
import PostComponent from '../components/PostComponent';
import { useThemeColors } from '../hooks/useThemeColors';
import { instadark, instalight, personAdd } from '../helper/images';
import { SettingMenu, SettingMenuDark } from '../helper/icon';
import BottomSheetComponent, {
  CommentType,
  BottomSheetHandler,
} from '../components/BottomSheetComponent';
import { getText } from '../constants/language/i18next';

interface Post {
  name: string;
  userImage: string;
  userId: string;
  postId: string;
  like: Array<string>;
  title: string;
  dateAndTime: string;
  description: string;
  currentUserID: string;
  postURL: Array<string>;
  comment: Array<CommentType>;
}

interface userData {
  id: string;
  userName: string;
  userImage: string;
}

const HomeScreen = ({ navigation }: any) => {
  const [post, setPost] = useState<Post[]>([]);

  const [isloading, setIsLoading] = useState(true);
  const [isrefreshing, setIsRefreshing] = useState(false);
  const [currentUserImage, setCurrentUserImage] = useState<string>('');
  const [postID, setPostID] = useState<string>('');
  const [initializing, setInitializing] = useState(true);
  const [postUserID, setPostUserID] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<any>(null);

  const { isDarkMode } = useTheme();
  const colors = useThemeColors();
  const styles = homeScreenStyle(colors);

  const userId = currentUser ? currentUser.uid : '';

  const bottomSheetRef = useRef<BottomSheetHandler>(null);
  const [selectedComments, setSelectedComments] = useState<CommentType[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = auth().onAuthStateChanged(user => {
      setCurrentUser(user);
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, [initializing]);

  useEffect(() => {
    getPost();
  }, [currentUser]);

  const handleOpenBottomSheet = (
    comments: CommentType[],
    postId: string,
    userId: string,
  ) => {
    setSelectedComments(comments);
    setPostID(postId);
    setPostUserID(userId);
    bottomSheetRef.current?.open();
  };

  const onRefresh = () => {
    setIsLoading(true);
    setIsRefreshing(true);
    getPost();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const getData = async (id: string, name: string, userImage: string) => {
    try {
      const data = await firestore()
        .collection('UsersData')
        .doc(id)
        .collection('PostData')
        .get();

      data.docs.forEach(item => {
        setPost(prevState => [
          ...prevState,
          {
            name: name,
            userImage: userImage,
            userId: id,
            postId: item.id,
            currentUserID: userId,
            ...item.data(),
          } as Post,
        ]);
      });
      setIsLoading(false);
      return data.docs;
    } catch (error) {
      setIsLoading(false);
      return;
    }
  };

  const getPost = async () => {
    setPost([]);
    try {
      const userIds: userData[] | undefined = await getAllUsersDataFirestore();
      await Promise.allSettled(
        (userIds ?? []).map(async (cv: userData) => {
          return await getData(cv.id, cv.userName, cv.userImage);
        }),
      );
      await firestore()
        .collection('UsersData')
        .doc(userId)
        .get()
        .then(doc => {
          if (doc.exists()) {
            const currentUserImage = doc.data()?.userImage;
            setCurrentUserImage(currentUserImage);
          }
        });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      showMessage({
        message: getText('error'),
        description: `${getText('error_message')} `,
        type: 'danger',
      });
    }
  };

  const getAllUsersDataFirestore = async () => {
    try {
      const usersCollection = await firestore()
        .collection('UsersData')
        .doc(userId)
        .get();
      const followingCollection = await firestore()
        .collection('UsersData')
        .get();

      const filteredUsers: userData[] = followingCollection.docs
        .filter(ele => usersCollection.data()?.following?.includes(ele.id))
        .map(ele => ({
          id: ele.id,
          userName: ele.data().firstName + ' ' + ele.data().lastName,
          userImage: ele.data().userImage,
        }));

      setIsLoading(false);
      return filteredUsers;
    } catch (error) {
      setIsLoading(false);
      showMessage({
        message: getText('error'),
        description: `${getText('error_message')} `,
        type: 'danger',
      });
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
      {isloading ? (
        <ActivityIndicator size={'large'} />
      ) : post.length == 0 ? (
        <View style={styles.noPostView}>
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.navigate('MyTab', { screen: 'SearchScreen' });
            }}
          >
            <Image source={personAdd} style={styles.addImageStyle} />
          </TouchableWithoutFeedback>
          <Text>Please Follow Other User to see post.</Text>
        </View>
      ) : (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={isrefreshing} onRefresh={onRefresh} />
          }
          data={post}
          keyExtractor={item => item.postId}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <>
              <PostComponent
                likes={item.like}
                title={item.title}
                comment={item.comment}
                date={item.dateAndTime}
                imagePost={item.postURL}
                description={item.description}
                userName={item.name}
                imageUrl={item.userImage}
                userId={item.userId}
                postId={item.postId}
                currentUserID={item.currentUserID}
                onOpenComments={() =>
                  handleOpenBottomSheet(item.comment, item.postId, item.userId)
                }
              />
            </>
          )}
        />
      )}
      {currentUserImage && (
        <BottomSheetComponent
          postID={postID}
          ref={bottomSheetRef}
          postUserID={postUserID}
          comments={selectedComments}
          userId={currentUser?.uid || ''}
          currentUserImage={currentUserImage}
        />
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;

const homeScreenStyle = (colors: ColorProps) =>
  StyleSheet.create({
    addImageStyle: {
      height: 50,
      width: 50,
    },
    noPostView: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    imageStyle: { alignSelf: 'center' },
    mainLayout: {
      flex: 1,
      backgroundColor: colors.background,
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
    userIcon: {
      marginBottom: '2%',
      alignSelf: 'flex-end',
    },
    actionBtn: {
      padding: 10,
      marginTop: 10,
      flexDirection: 'row',
    },
    heartStyle: {
      marginHorizontal: 10,
    },
    logoView: {
      flex: 1,
      marginTop: 10,
      marginHorizontal: 10,
      justifyContent: 'flex-end',
    },
  });
