import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import firestore, {
  arrayRemove,
  arrayUnion,
} from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';

import ButtonComponent from './ButtonComponent';
import { ColorProps } from '../constants/color';
import { useThemeColors } from '../hooks/useThemeColors';

import { LanguageConstant } from '../constants/language_constants';
import { t } from 'i18next';

interface UserListProp {
  userId?: string;
  imageUrl: string;
  firstName: string;
  currentUserId: string;
  isFollowed?: boolean;
  isRequested?: boolean;
  lastName: string;
}

const UserListComponent: React.FC<UserListProp> = ({
  userId,
  firstName,
  imageUrl,
  currentUserId,
  isFollowed,
  isRequested,
  lastName,
}) => {
  const colors = useThemeColors();
  const styles = userListComponentStyle(colors);
  const database = firestore().collection('UsersData');

  const addFollowRequest = async () => {
    try {
      await database
        .doc(userId)
        .update({ requestCome: arrayUnion(currentUserId) })
        .then(() => {
          showMessage({
            message: t(LanguageConstant.followRequestSent),
            type: 'success',
          });
        });
    } catch (error) {
      showMessage({
        message: t(LanguageConstant.error),
        description: `${t(LanguageConstant.error_message)}  ${error}`,
        type: 'danger',
      });
    }
  };
  const sentFollowRequest = async () => {
    try {
      await database
        .doc(currentUserId)
        .update({ requestSent: arrayUnion(userId) })
        .then(() => {
          showMessage({
            message: t(LanguageConstant.followRequestSent),
            type: 'success',
          });
        });
    } catch (error) {
      showMessage({
        message: t(LanguageConstant.error),
        description: `${t(LanguageConstant.error_message)}  ${error}`,
        type: 'danger',
      });
    }
  };

  const followRequest = () => {
    addFollowRequest();
    sentFollowRequest();
  };

  const removeFollowRequest = async () => {
    try {
      await database
        .doc(currentUserId)
        .update({ requestSent: arrayRemove(userId) })
        .then(() => {
          showMessage({
            message: t(LanguageConstant.cancelFollowRequest),
            type: 'success',
          });
        });
    } catch (error) {
      showMessage({
        message: t(LanguageConstant.error),
        description: t(LanguageConstant.error_message) + ' ' + error,
        type: 'success',
      });
    }
  };

  const removeComeFollowRequest = async () => {
    try {
      await database
        .doc(userId)
        .update({ requestCome: arrayRemove(currentUserId) })
        .then(() => {
          showMessage({
            message: t(LanguageConstant.cancelFollowRequest),
            type: 'success',
          });
        });
    } catch (error) {
      showMessage({
        message: t(LanguageConstant.error),
        description: t(LanguageConstant.error_message) + ' ' + error,
        type: 'success',
      });
    }
  };

  const removeRequest = () => {
    removeFollowRequest();
    removeComeFollowRequest();
  };

  const removeFollower = async () => {
    try {
      await database
        .doc(userId)
        .update({ follower: arrayRemove(currentUserId) })
        .then(() => {
          showMessage({
            message: `${t(LanguageConstant.youUnFollowed)} ` + firstName,
            type: 'success',
          });
        });
    } catch (error) {
      showMessage({
        message: t(LanguageConstant.error),
        description: `${t(LanguageConstant.error_message)}  ${error}`,
        type: 'danger',
      });
    }
  };
  const removeFollowing = async () => {
    try {
      await database
        .doc(currentUserId)
        .update({ following: arrayRemove(userId) })
        .then(() => {
          showMessage({
            message: `${t(LanguageConstant.youUnFollowed)} ` + firstName,
            type: 'success',
          });
        });
    } catch (error) {
      showMessage({
        message: t(LanguageConstant.error),
        description: `${t(LanguageConstant.error_message)}  ${error}`,
        type: 'danger',
      });
    }
  };
  const Unfollow = () => {
    removeFollower();
    removeFollowing();
  };

  return (
    <View style={styles.mainLayout}>
      <Image source={{ uri: imageUrl }} style={styles.imageStyle} />
      <View style={styles.textView}>
        <Text style={styles.txtNameStyle}>{`${firstName} ${lastName}`}</Text>

        {userId == currentUserId ? (
          <View />
        ) : isRequested ? (
          <View style={styles.buttonStyle}>
            <ButtonComponent
              title={t(LanguageConstant.cancelRequest)}
              onClick={removeRequest}
              btnStyle={styles.btnUnfollowStyle}
              textStyle={styles.txtUnfollowStyle}
            />
          </View>
        ) : isFollowed ? (
          <View style={styles.buttonStyle}>
            <ButtonComponent
              title={t(LanguageConstant.unFollow)}
              onClick={Unfollow}
              btnStyle={styles.btnUnfollowStyle}
              textStyle={styles.txtUnfollowStyle}
            />
          </View>
        ) : (
          <View style={styles.buttonStyle}>
            <ButtonComponent
              title={t(LanguageConstant.follow)}
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
      fontSize: 16,
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
      fontSize: 15,
      fontWeight: '500',
      textAlignVertical: 'center',
    },
    textStyle: {
      flex: 1,
      color: colors.white,
      fontSize: 16,
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
