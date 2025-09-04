import React from 'react';
import { Image, StyleSheet, Text, useColorScheme, View } from 'react-native';

import moment from 'moment';
import { t } from 'i18next';

import {
  More,
  Message,
  SaveDark,
  HeartDark,
  MessageDark,
  CommnetDark,
} from '../helper/icon';
import { Comment, Save } from '../helper/icon';
import { ColorProps } from '../constants/color';
import ImagesComponent from './ImagesComponent';
import Heart from '../assets/icons/HeartOutline.svg';
import { useThemeColors } from '../hooks/useThemeColors';
import { LanguageConstant } from '../constants/language_constants';
import { fs } from '../helper/fontSize';

interface PostProp {
  date: string;
  likes: number;
  title: string;
  comment: number;
  imageUrl: string;
  description: string;
  imagePost: Array<string>;
}

const PostComponent: React.FC<PostProp> = ({
  likes,
  title,
  description,
  imagePost,
  date,
  imageUrl,
}) => {
  const colorScheme = useColorScheme();
  const postCreationDateTime = moment(date, 'MM/DD/YYYY hh:mm:ss a');
  const calculatedDateTime = postCreationDateTime.fromNow();
  const colors = useThemeColors();
  const styles = postComponentStyle(colors);

  return (
    <View style={styles.mainLayoutStyle}>
      <View style={styles.modalStyle}>
        <View style={styles.upperPostStyle}>
          <View style={styles.headerStyle}>
            <View style={styles.titleImageStyle}>
              <Image style={styles.profilePicStyle} src={imageUrl} />
            </View>
            <View style={styles.moreBtnStyle}>
              <More height={30} width={30} stroke={colors.text} />
            </View>
          </View>
          <Text style={styles.textStyle}>{title}</Text>
        </View>
        <View style={styles.postStyle}>
          <ImagesComponent imagePost={imagePost} />
        </View>
      </View>
      <View style={styles.actionsStyle}>
        <View style={styles.actionBtnStyle}>
          {colorScheme === 'light' ? (
            <Heart />
          ) : (
            <HeartDark height={25} width={25} />
          )}
          <View style={styles.commentBtnStyle}>
            {colorScheme === 'light' ? (
              <Comment />
            ) : (
              <CommnetDark height={28} width={28} stroke={colors.text} />
            )}
          </View>
          {colorScheme === 'light' ? (
            <Message />
          ) : (
            <MessageDark height={25} width={25} />
          )}
        </View>
        <View style={styles.saveBtnStyle}>
          {colorScheme === 'light' ? (
            <Save />
          ) : (
            <SaveDark height={30} width={30} />
          )}
        </View>
      </View>

      <Text style={styles.likeStyle}>
        {likes + ' ' + t(LanguageConstant.likes)}
      </Text>

      {description && (
        <View style={styles.descriptionStyle}>
          <Text style={styles.textStyle}>{description}</Text>
        </View>
      )}

      <Text style={styles.fotterStyle}>{calculatedDateTime}</Text>
    </View>
  );
};

export default PostComponent;

const postComponentStyle = (colors: ColorProps) =>
  StyleSheet.create({
    textStyle: { color: colors.text },

    fotterStyle: {
      paddingBottom: 10,
      color: colors.text,
      flexDirection: 'row',
      paddingHorizontal: 20,
      justifyContent: 'space-between',
    },

    likeStyle: {
      fontSize: fs(14),
      paddingTop: 10,
      fontWeight: '700',
      color: colors.text,
      paddingHorizontal: 20,
    },
    moreBtnStyle: {
      marginTop: 15,
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    profilePicStyle: {
      width: 40,
      height: 40,
      marginRight: 10,
      borderRadius: 50,
    },

    titleImageStyle: {
      flex: 0.7,
      flexDirection: 'row',
    },
    commentBtnStyle: {
      marginHorizontal: 10,
    },
    saveBtnStyle: {
      flex: 1,
      alignItems: 'flex-end',
    },
    actionBtnStyle: {
      flex: 0.1,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    actionsStyle: {
      paddingTop: 10,
      flexDirection: 'row',
      paddingHorizontal: 20,
    },
    upperPostStyle: {
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    descriptionStyle: {
      paddingVertical: 10,
      paddingHorizontal: 20,
    },

    modalStyle: {
      borderBottomWidth: 1,
      borderColor: colors.modalBorderStyle,
    },
    mainLayoutStyle: {
      flex: 1,
      borderBottomWidth: 1,
      backgroundColor: colors.background,
      borderColor: colors.modalBorderStyle,
    },
    headerStyle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    postStyle: {
      height: 200,
    },
  });
