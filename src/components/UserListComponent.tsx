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

interface UserListProp {
  userId: string;
  imageUrl: string;
  userName: string;
  currentUserId: string;
  isFollowed: boolean;
}

const UserListComponent: React.FC<UserListProp> = ({
  userId,
  userName,
  imageUrl,
  currentUserId,
  isFollowed,
}) => {
  const colors = useThemeColors();
  const styles = userListComponentStyle(colors);
  const database = firestore().collection('UsersData');
  const addFollower = async () => {
    try {
      await database
        .doc(userId)
        .update({ follower: arrayUnion(currentUserId) })
        .then(() => {
          showMessage({
            message: 'You Started Following ' + userName,

            type: 'success',
          });
        });
    } catch (error) {
      showMessage({
        message: 'Error',
        description: 'There are some Error ' + error,
        type: 'success',
      });
    }
  };

  const addFollowing = async () => {
    try {
      await database
        .doc(currentUserId)
        .update({ following: arrayUnion(userId) })
        .then(() => {
          showMessage({
            message: 'You  Followed ' + userName,
            type: 'success',
          });
        });
    } catch (error) {
      showMessage({
        message: 'Error',
        description: 'There are some Error ' + error,
        type: 'success',
      });
    }
  };

  const Follow = () => {
    addFollower();
    addFollowing();
  };

  const removeFollower = async () => {
    try {
      await database
        .doc(userId)
        .update({ follower: arrayRemove(currentUserId) })
        .then(() => {
          showMessage({
            message: 'You UnFollowed ' + userName,
            type: 'success',
          });
        });
    } catch (error) {
      showMessage({
        message: 'Error',
        description: 'There are some Error ' + error,
        type: 'success',
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
            message: 'You UnFollowed ' + userName,
            type: 'success',
          });
        });
    } catch (error) {
      showMessage({
        message: 'Error',
        description: 'There are some Error ' + error,
        type: 'success',
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
        <Text style={styles.txtNameStyle}>{userName}</Text>

        {userId == currentUserId ? (
          <View />
        ) : isFollowed ? (
          <View style={styles.buttonStyle}>
            <ButtonComponent
              title="Unfollow"
              onClick={Unfollow}
              btnStyle={styles.btnUnfollowStyle}
              textStyle={styles.txtUnfollowStyle}
            />
          </View>
        ) : (
          <View style={styles.buttonStyle}>
            <ButtonComponent
              title="Follow"
              onClick={Follow}
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
      marginVertical: 10,
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
      marginVertical: 10,
      backgroundColor: colors.primaryblue,
    },

    mainLayout: {
      flex: 1,
      borderRadius: 10,
      flexDirection: 'row',
      padding: 10,
    },
    imageStyle: {
      flex: 0.5,
      height: 70,
      maxWidth: 70,
      borderRadius: 50,
    },
    txtNameStyle: {
      flex: 1,
      padding: 20,
      fontSize: 16,
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
      flex: 1,
      justifyContent: 'center',
    },
  });
