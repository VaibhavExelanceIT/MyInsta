import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { fs } from '../helper/fontSize';
import { ColorProps } from '../constants/color';
import { useThemeColors } from '../hooks/useThemeColors';

interface UserListProp {
  imageUrl: string;
  userName: string;
}

const UserFollowerList: React.FC<UserListProp> = ({ userName, imageUrl }) => {
  const colors = useThemeColors();
  const styles = userListComponentStyle(colors);

  return (
    <View style={styles.mainLayout}>
      <Image source={{ uri: imageUrl }} style={styles.imageStyle} />
      <View style={styles.textView}>
        <Text style={styles.txtNameStyle}>{userName}</Text>
      </View>
    </View>
  );
};

export default UserFollowerList;

const userListComponentStyle = (colors: ColorProps) =>
  StyleSheet.create({
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
      height: 50,
      maxWidth: 50,
      borderRadius: 50,
    },
    txtNameStyle: {
      color: colors.text,
      flex: 1,

      marginHorizontal: 23,
      fontSize: fs(16),
      fontWeight: '400',
      textAlignVertical: 'center',
    },

    textView: {
      flex: 1,
    },
  });
