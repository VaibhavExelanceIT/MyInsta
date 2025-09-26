import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import firestore, {
  arrayRemove,
  arrayUnion,
} from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';

import { fs } from '../helper/fontSize';
import { ColorProps } from '../constants/color';
import ButtonComponent from './ButtonComponent';
import { getText } from '../constants/language/i18next';
import { useThemeColors } from '../hooks/useThemeColors';
import { CorrectLight, CrossLight } from '../helper/icon';

interface UserRequestListProp {
  userId: string;
  imageUrl: string;
  userName: string;
  isRequested: boolean;
  currentUserId: string;
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

  const acceptRequest = async () => {
    try {
      await database
        .doc(currentUserId)
        .update({ follower: arrayUnion(userId) })
        .catch(err => {
          throw err;
        });

      await database
        .doc(userId)
        .update({ following: arrayUnion(currentUserId) })
        .catch(err => {
          throw err;
        });
      removeRequest();

      showMessage({
        message: `${getText('youFollowed')}` + userName,
        type: 'success',
      });
    } catch (error) {
      showMessage({
        message: getText('error'),
        description: getText('error_message'),
        type: 'success',
      });
    }
  };

  const removeRequest = async () => {
    try {
      await database
        .doc(userId)
        .update({ requestSent: arrayRemove(currentUserId) })
        .catch(err => {
          throw err;
        });

      await database
        .doc(currentUserId)
        .update({ requestCome: arrayRemove(userId) })
        .catch(err => {
          throw err;
        });

      showMessage({
        message: getText('cancelFollowRequest'),
        type: 'success',
      });
    } catch (error) {
      showMessage({
        message: getText('error'),
        description: getText('error_message'),
        type: 'success',
      });
    }
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
                title={getText('decline')}
                onClick={removeRequest}
                btnStyle={styles.btnDeclineStyle}
                textStyle={styles.txtDeclineStyle}
                IconComponent={CrossLight}
              />
            </View>
            <View style={styles.buttonStyle}>
              <ButtonComponent
                title={getText('accept')}
                onClick={acceptRequest}
                btnStyle={styles.btnAcceptStyle}
                textStyle={styles.txtAcceptStyle}
                IconComponent={CorrectLight}
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
      borderWidth: 2,
      borderRadius: 6,
      marginVertical: 10,
      backgroundColor: colors.declineBtnStyle,
      borderColor: colors.declineBtnBorderStyle,
    },
    btnAcceptStyle: {
      padding: 10,
      borderWidth: 2,
      borderRadius: 6,
      marginVertical: 10,
      backgroundColor: colors.acceptBtnStyle,
      borderColor: colors.acceptBtnBorderStyle,
    },
    txtAcceptStyle: {
      flex: 1,
      fontSize: fs(16),
      fontWeight: '500',
      textAlign: 'center',
      color: colors.white,
      textAlignVertical: 'center',
    },
    txtDeclineStyle: {
      flex: 1,
      fontSize: fs(16),
      fontWeight: '500',
      color: colors.white,
      textAlign: 'center',
      textAlignVertical: 'center',
    },

    btnStyle: {
      padding: 10,
      borderRadius: 6,
      marginVertical: 15,
      backgroundColor: colors.primaryblue,
    },

    mainLayout: {
      padding: 10,
      elevation: 3,
      borderRadius: 20,
      marginVertical: 5,
      flexDirection: 'row',
      marginHorizontal: 10,
      borderBottomWidth: 0.2,
      borderBottomColor: colors.commentTextStyle,
      backgroundColor: colors.listBackgroundColor,
    },
    imageStyle: {
      flex: 1,
      height: 70,
      maxWidth: 70,
      borderRadius: 50,
      alignSelf: 'center',
      flexDirection: 'row',
    },
    txtNameStyle: {
      flex: 1,
      padding: 20,
      fontSize: fs(15),
      fontWeight: '500',
      color: colors.text,
      textAlignVertical: 'center',
    },
    textStyle: {
      flex: 1,
      fontSize: fs(16),
      fontWeight: '500',
      textAlign: 'center',
      color: colors.white,
    },
    textView: {
      flex: 1,
      flexDirection: 'row',
    },

    buttonStyle: {
      marginHorizontal: 5,
    },
  });
