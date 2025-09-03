import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';

import firestore, {
  arrayRemove,
  arrayUnion,
} from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';
import { t } from 'i18next';

import { ColorProps } from '../constants/color';
import ButtonComponent from './ButtonComponent';

import { useThemeColors } from '../hooks/useThemeColors';
import { LanguageConstant } from '../constants/language_constants';

interface UserRequestListProp {
  userId: string;
  imageUrl: string;
  userName: string;
  currentUserId: string;

  isRequested: boolean;
}
const UserRequestListComponent: React.FC<UserRequestListProp> = ({
  userId,
  userName,
  imageUrl,
  currentUserId,
}) => {
  const colors = useThemeColors();
  const styles = userRequestListComponentStyle(colors);
  const database = firestore().collection('UsersData');

  const addFollower = async () => {
    try {
      await database
        .doc(currentUserId)
        .update({ follower: arrayUnion(userId) })
        .then(() => {
          showMessage({
            message: `${t(LanguageConstant.youStartedFollowing)}` + userName,
            type: 'success',
          });
        });
    } catch (error) {
      showMessage({
        message: t(LanguageConstant.error),
        description: `${t(LanguageConstant.error_message)}` + error,
        type: 'success',
      });
    }
  };

  const addFollowing = async () => {
    try {
      await database
        .doc(userId)
        .update({ following: arrayUnion(currentUserId) })
        .then(() => {
          showMessage({
            message: `${t(LanguageConstant.youFollowed)}` + userName,
            type: 'success',
          });
        });
    } catch (error) {
      showMessage({
        message: t(LanguageConstant.error),
        description: `${t(LanguageConstant.error_message)}` + error,
        type: 'success',
      });
    }
  };
  const acceptRequest = () => {
    addFollower();
    addFollowing();
    removeRequest();
  };

  const removeFollowRequest = async () => {
    try {
      await database
        .doc(userId)
        .update({ requestSent: arrayRemove(currentUserId) })
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
        .doc(currentUserId)
        .update({ requestCome: arrayRemove(userId) })
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

  return (
    <View style={styles.mainLayout}>
      <Image source={{ uri: imageUrl }} style={styles.imageStyle} />
      <View style={styles.textView}>
        <Text style={styles.txtNameStyle}>{userName}</Text>

        {userId == currentUserId ? (
          <View />
        ) : (
          <>
            <View style={styles.buttonStyle}>
              <ButtonComponent
                title={t(LanguageConstant.decline)}
                onClick={removeRequest}
                btnStyle={styles.btnDeclineStyle}
                textStyle={styles.txtDeclineStyle}
                isDecline={true}
              />
            </View>
            <View style={styles.buttonStyle}>
              <ButtonComponent
                title={t(LanguageConstant.accept)}
                onClick={acceptRequest}
                btnStyle={styles.btnAcceptStyle}
                textStyle={styles.txtAcceptStyle}
                isAccept={true}
              />
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default UserRequestListComponent;

const userRequestListComponentStyle = (colors: ColorProps) =>
  StyleSheet.create({
    btnDeclineStyle: {
      padding: 10,
      borderRadius: 6,
      marginVertical: 10,
      borderWidth: 2,
      backgroundColor: colors.declineBtnStyle,
      borderColor: colors.declineBtnBorderStyle,
    },
    btnAcceptStyle: {
      padding: 10,
      marginVertical: 10,
      borderRadius: 6,
      borderWidth: 2,
      backgroundColor: colors.acceptBtnStyle,
      borderColor: colors.acceptBtnBorderStyle,
    },
    txtAcceptStyle: {
      flex: 1,
      textAlign: 'center',
      fontSize: 16,
      fontWeight: '500',
      textAlignVertical: 'center',
      color: colors.white,
    },
    txtDeclineStyle: {
      flex: 1,
      textAlign: 'center',
      fontSize: 16,
      fontWeight: '500',
      textAlignVertical: 'center',
      color: colors.white,
    },

    btnStyle: {
      padding: 10,
      borderRadius: 6,
      marginVertical: 15,
      backgroundColor: colors.primaryblue,
    },

    mainLayout: {
      backgroundColor: colors.background,
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
      flexDirection: 'row',
      alignSelf: 'center',
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
    },

    buttonStyle: {
      marginHorizontal: 5,
    },
  });
