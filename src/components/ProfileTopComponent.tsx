import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { t } from 'i18next';
import firestore from '@react-native-firebase/firestore';

import { CrossLight } from '../helper/icon';
import { ColorProps } from '../constants/color';
import ButtonComponent from './ButtonComponent';
import { useThemeColors } from '../hooks/useThemeColors';
import ProfileTextComponent from './ProfileTextComponent';
import { LanguageConstant } from '../constants/language_constants';
import UserFollowerList from './UserFollowerList';

interface ProfileTopProp {
  follower: number;
  following: number;
  totalPost: number;
  userName: string;
  profilePhoto: string;
  currentUserId: string;
}

interface userData {
  imageUrl: string;
  userName: string;
}

const ProfileTopComponent: React.FC<ProfileTopProp> = ({
  follower,
  userName,
  following,
  totalPost,
  profilePhoto,
  currentUserId,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserData, setIsUserData] = useState<Array<userData>>([]);

  const colors = useThemeColors();
  const styles = profileTopComponentStyle(colors);

  const onModalClose = () => {
    setIsModalOpen(false);
  };

  const getFollowingData = async () => {
    const usersCollection = await firestore()
      .collection('UsersData')
      .doc(currentUserId)
      .get();

    const followingCollection = await firestore().collection('UsersData').get();
    setIsUserData([]);

    const filteredUsers = followingCollection.docs
      .filter(ele => usersCollection.data()?.following?.includes(ele.id))
      .map(ele => ({
        imageUrl: ele.data().userImage,
        userName: ele.data().firstName + ' ' + ele.data().lastName,
      }));

    setIsUserData(filteredUsers);
    setModalOpen();
  };

  const getFollowerData = async () => {
    const usersCollection = await firestore()
      .collection('UsersData')
      .doc(currentUserId)
      .get();

    const followerCollection = await firestore().collection('UsersData').get();
    setIsUserData([]);

    const filteredUsers = followerCollection.docs
      .filter(ele => usersCollection.data()?.follower?.includes(ele.id))
      .map(ele => ({
        imageUrl: ele.data().userImage,
        userName: ele.data().firstName + ' ' + ele.data().lastName,
      }));

    setIsUserData(filteredUsers);
    setModalOpen();
  };

  const setModalOpen = () => {
    setIsModalOpen(true);
  };
  return (
    <View style={styles.container}>
      <View style={styles.mainLayout}>
        <Image src={profilePhoto} style={styles.imageStyle} />

        <ProfileTextComponent
          textData={totalPost}
          textTitle={t(LanguageConstant.post)}
        />

        <TouchableOpacity
          onPress={getFollowerData}
          style={styles.postTextStyle}
        >
          <ProfileTextComponent
            textData={follower}
            textTitle={t(LanguageConstant.follower)}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={getFollowingData}
          style={styles.postTextStyle}
        >
          <ProfileTextComponent
            textData={following}
            textTitle={t(LanguageConstant.following)}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.textView}>
        <Text style={styles.textColor}>{userName}</Text>
      </View>
      <View style={styles.btnView}>
        <ButtonComponent
          onClick={() => {}}
          title={t(LanguageConstant.editProfile)}
          btnStyle={styles.btnStyle}
          textStyle={styles.textStyle}
        />
      </View>

      <Modal
        transparent={false}
        animationType="slide"
        visible={isModalOpen}
        onRequestClose={onModalClose}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={onModalClose}
              style={styles.btnCloseStyle}
            >
              <CrossLight height={30} width={30} />
            </TouchableOpacity>

            <View style={styles.listStyle}>
              <FlatList
                data={isUserData}
                renderItem={({ item }) => {
                  return (
                    <UserFollowerList
                      imageUrl={item.imageUrl}
                      userName={item.userName}
                    />
                  );
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileTopComponent;

const profileTopComponentStyle = (colors: ColorProps) =>
  StyleSheet.create({
    postTextStyle: {
      flexDirection: 'row',
      flex: 1,
    },
    btnView: {
      flex: 1,
      marginVertical: 10,
      marginHorizontal: 20,
    },
    container: {
      flex: 1,
      backgroundColor: colors.profileBackground,
    },
    mainLayout: {
      marginTop: 20,
      marginBottom: 10,
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    imageStyle: {
      height: 100,
      width: 100,
      borderWidth: 5,
      marginLeft: 20,
      borderRadius: 50,
      borderColor: colors.inputTextBorder,
    },
    textStyle: {
      flex: 1,
      padding: 5,
      color: colors.text,
    },
    textView: { alignSelf: 'flex-start', marginLeft: 30 },
    textColor: {
      fontWeight: '600',
      color: colors.text,
    },
    btnStyle: {
      borderWidth: 1,
      borderRadius: 5,
      borderColor: colors.inputTextBorder,
    },
    btnCloseStyle: {
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 20,
      alignSelf: 'flex-end',
      borderColor: colors.listBackgroundColor,
      backgroundColor: colors.commentTextStyle,
    },
    centeredView: {
      flex: 1,
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
    },
    modalView: {
      flex: 1,
      padding: 5,
      elevation: 5,
      width: '100%',
      height: '100%',
      shadowRadius: 4,
      shadowOpacity: 0.25,
      shadowColor: colors.text,

      shadowOffset: {
        width: 0,
        height: 2,
      },
    },
    listStyle: {
      flex: 1,
      justifyContent: 'flex-start',
    },
  });
