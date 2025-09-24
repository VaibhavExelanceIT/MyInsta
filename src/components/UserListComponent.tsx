import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import firestore, {
  arrayRemove,
  arrayUnion,
} from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';

import { fs } from '../helper/fontSize';
import ButtonComponent from './ButtonComponent';
import { ColorProps } from '../constants/color';
import { useThemeColors } from '../hooks/useThemeColors';
import { sendNotification } from '../api/followNotification';
import { getText } from '../constants/language/i18next';

interface UserListProp {
  userId?: string;
  imageUrl: string;
  lastName: string;
  firstName: string;
  isFollowed?: boolean;
  isRequested?: boolean;
  currentUserId: string;
  onActionComplete: () => void;
}

const UserListComponent: React.FC<UserListProp> = ({
  userId,
  imageUrl,
  lastName,
  firstName,
  isFollowed,
  isRequested,
  currentUserId,
  onActionComplete,
}) => {
  const colors = useThemeColors();
  const styles = userListComponentStyle(colors);
  const database = firestore().collection('UsersData');

  const getToken = async () => {
    const data = await firestore().collection('UsersData').doc(userId).get();
    return data.data()?.token;
  };
  const followRequest = async () => {
    try {
      const token: string = await getToken();
      await database
        .doc(currentUserId)
        .update({ requestSent: arrayUnion(userId) })
        .catch(err => {
          throw err;
        });
      await database
        .doc(userId)
        .update({ requestCome: arrayUnion(currentUserId) })
        .catch(err => {
          throw err;
        });

      sendNotification(
        token,
        'You have new follow request',
        `vaibhav sent you a followed Request`,
        'NotificationScreen',
      );

      console.log('🚀 ~ followRequest ~ currentUserId:', currentUserId);
      console.log('🚀 ~ followRequest ~ userId:', userId);
      showMessage({
        message: getText('followRequestSent'),
        type: 'success',
      });
      onActionComplete();
    } catch (error) {
      console.log('🚀 ~ followRequest ~ error:', error);
      showMessage({
        message: getText('error'),
        description: getText('error_message'),
        type: 'danger',
      });
    }
  };

  const removeRequest = async () => {
    try {
      await database
        .doc(currentUserId)
        .update({ requestSent: arrayRemove(userId) })
        .catch(err => {
          throw err;
        });

      await database
        .doc(userId)
        .update({ requestCome: arrayRemove(currentUserId) })
        .catch(err => {
          throw err;
        });

      showMessage({
        message: getText('cancelFollowRequest'),
        type: 'success',
      });
      onActionComplete();
    } catch (error) {
      console.log('🚀 ~ removeRequest ~ error:', error);
      showMessage({
        message: getText('error'),
        description: getText('error_message'),
        type: 'danger',
      });
    }
  };

  const onUnfollow = async () => {
    try {
      await database
        .doc(userId)
        .update({ follower: arrayRemove(currentUserId) })
        .catch(err => {
          throw err;
        });

      await database
        .doc(currentUserId)
        .update({ following: arrayRemove(userId) })
        .catch(err => {
          throw err;
        });

      showMessage({
        message: `${getText('youUnFollowed')} ` + firstName,
        type: 'success',
      });
      onActionComplete();
    } catch (error) {
      console.log('🚀 ~ onUnfollow ~ error:', error);
      showMessage({
        message: getText('error'),
        description: getText('error_message'),
        type: 'danger',
      });
    }
  };

  return (
    <View style={styles.mainLayout}>
      <Image source={{ uri: imageUrl }} style={styles.imageStyle} />
      <View style={styles.textView}>
        <Text style={styles.txtNameStyle}>{`${firstName} ${lastName}`}</Text>

        {isRequested ? (
          <View style={styles.buttonStyle}>
            <ButtonComponent
              title={getText('cancelRequest')}
              onClick={removeRequest}
              btnStyle={styles.btnUnfollowStyle}
              textStyle={styles.txtUnfollowStyle}
            />
          </View>
        ) : isFollowed ? (
          <View style={styles.buttonStyle}>
            <ButtonComponent
              title={getText('unFollow')}
              onClick={onUnfollow}
              btnStyle={styles.btnUnfollowStyle}
              textStyle={styles.txtUnfollowStyle}
            />
          </View>
        ) : (
          <View style={styles.buttonStyle}>
            <ButtonComponent
              title={getText('follow')}
              onClick={followRequest}
              btnStyle={styles.btnStyle}
              textStyle={styles.textStyle}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default UserListComponent;

const userListComponentStyle = (colors: ColorProps) =>
  StyleSheet.create({
    btnUnfollowStyle: {
      padding: 10,
      borderRadius: 6,
      marginVertical: 15,
      backgroundColor: colors.modalBorderStyle,
    },
    txtUnfollowStyle: {
      flex: 1,
      textAlign: 'center',
      fontSize: fs(16),
      fontWeight: '500',
      textAlignVertical: 'center',
      color: colors.placeholderTextColor,
    },

    btnStyle: {
      padding: 10,
      borderRadius: 6,
      marginVertical: 15,
      height: '60%',
      width: 100,
      backgroundColor: colors.primaryblue,
    },

    mainLayout: {
      backgroundColor: colors.listBackgroundColor,

      elevation: 3,
      marginVertical: 5,
      marginHorizontal: 10,
      borderRadius: 20,
      flexDirection: 'row',
      padding: 10,
      borderBottomWidth: 0.2,
      borderBottomColor: colors.commentTextStyle,
    },
    imageStyle: {
      flex: 1,
      height: 70,
      maxWidth: 70,
      borderRadius: 50,
    },
    txtNameStyle: {
      color: colors.text,
      flex: 1,
      padding: 20,
      fontSize: fs(15),
      fontWeight: '500',
      textAlignVertical: 'center',
    },
    textStyle: {
      flex: 1,
      color: colors.white,
      fontSize: fs(16),
      fontWeight: '500',
      textAlign: 'center',
    },
    textView: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },

    buttonStyle: {
      justifyContent: 'center',
    },
  });
