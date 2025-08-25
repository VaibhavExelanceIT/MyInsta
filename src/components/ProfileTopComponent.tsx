import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';

import ButtonComponent from './ButtonComponent';
import ProfileTextComponent from './ProfileTextComponent';
import { ColorProps } from '../constants/color';
import { useThemeColors } from '../hooks/useThemeColors';

interface ProfileTopProp {
  follower: number;
  following: number;
  totalPost: number;
  userName: string;
  ProfilePhoto: string;
}

const ProfileTopComponent: React.FC<ProfileTopProp> = ({
  follower,
  following,
  totalPost,
  userName,
  ProfilePhoto,
}) => {
  const colors = useThemeColors();
  const styles = profileTopComponentStyle(colors);
  return (
    <View style={styles.container}>
      <View style={styles.mainLayout}>
        <Image src={ProfilePhoto} style={styles.imageStyle} />
        <ProfileTextComponent textData={totalPost} textTitle="Post" />
        <ProfileTextComponent textData={follower} textTitle="Follower" />
        <ProfileTextComponent textData={following} textTitle="Following" />
      </View>
      <View style={styles.textView}>
        <Text style={styles.textColor}>{userName}</Text>
      </View>
      <View style={styles.btnView}>
        <ButtonComponent
          onClick={() => {}}
          title="Edit Profile"
          btnStyle={styles.btnStyle}
          textStyle={styles.textStyle}
        />
      </View>
    </View>
  );
};

export default ProfileTopComponent;

const profileTopComponentStyle = (colors: ColorProps) =>
  StyleSheet.create({
    btnView: {
      height: 50,
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
      alignSelf: 'center',
      alignItems: 'center',
      textAlignVertical: 'center',
    },
    textView: { alignSelf: 'flex-start', marginLeft: 30 },
    textColor: {
      fontWeight: '600',
      color: colors.text,
    },
    btnStyle: {
      flex: 1,
      borderWidth: 1,
      borderRadius: 10,
      backgroundColor: colors.background,
      borderColor: colors.inputTextBorder,
    },
  });
