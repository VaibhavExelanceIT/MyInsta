import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import firestore from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';

import { fs } from '../helper/fontSize';
import { ColorProps } from '../constants/color';
import { getText } from '../constants/language/i18next';
import { useThemeColors } from '../hooks/useThemeColors';

interface CommentProps {
  comment: string;
  userID: string;
}

interface UserData {
  imageUrl: string;
  firstName: string;
  lastName: string;
}

const CommentComponent: React.FC<CommentProps> = ({ comment, userID }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUserData, setIsUserData] = useState<Array<UserData>>([]);

  const colors = useThemeColors();
  const styles = commentComponentStyle(colors);

  const getUserData = async () => {
    try {
      setIsLoading(true);
      const userData = [];
      const data = await firestore().collection('UsersData').doc(userID).get();

      userData.push({
        imageUrl: data.data()?.userImage,
        firstName: data.data()?.firstName,
        lastName: data.data()?.lastName,
      });
      setIsUserData(userData);
      setIsLoading(false);
    } catch (error) {
      showMessage({
        message: getText('error_message'),
        type: 'danger',
      });

      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);
  return (
    <View>
      {isLoading ? (
        <Text style={styles.loaderStyle}>{getText('loading')}</Text>
      ) : (
        <View style={styles.viewStyle}>
          {isUserData.length > 0 && (
            <>
              <Image
                source={{ uri: isUserData[0].imageUrl, height: 40, width: 40 }}
                style={styles.imageStyle}
              />
              <View>
                <Text
                  style={styles.nameStyle}
                >{`${isUserData[0].firstName} ${isUserData[0].lastName}`}</Text>
                <Text style={styles.commentStyle}>{comment}</Text>
              </View>
            </>
          )}
        </View>
      )}
    </View>
  );
};

export default CommentComponent;

const commentComponentStyle = (color: ColorProps) =>
  StyleSheet.create({
    loaderStyle: { color: color.text },
    commentStyle: {
      margin: 4,
      fontSize: fs(12),
      color: color.text,
      fontWeight: 'black',
    },
    nameStyle: { fontWeight: '700', fontSize: fs(12), color: color.text },
    imageStyle: { borderRadius: 20, marginRight: 10 },
    viewStyle: { flexDirection: 'row', borderBottomWidth: 0.2 },
  });
