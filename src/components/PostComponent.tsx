import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import moment from 'moment';
import { t } from 'i18next';
import firestore, {
  arrayRemove,
  arrayUnion,
} from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';

import {
  Message,
  HeartDark,
  MessageDark,
  CommnetDark,
  LikedHeart,
} from '../helper/icon';
import { Comment } from '../helper/icon';
import { ColorProps } from '../constants/color';
import Heart from '../assets/icons/HeartOutline.svg';
import { useThemeColors } from '../hooks/useThemeColors';
import { LanguageConstant } from '../constants/language_constants';
import { fs } from '../helper/fontSize';
import CarouselComponent from './CarouselComponent';
import { useTheme } from '../hooks/useTheme';

interface PostProp {
  date: string;
  likes: Array<string>;
  title: string;
  comment: Array<object>;
  imageUrl: string;
  description: string;
  imagePost: Array<string>;
  userName: string;
  userId: string;
  postId: string;
  currentUserID: string;
  onOpenComments: () => void;
}

const PostComponent: React.FC<PostProp> = ({
  likes,
  title,
  description,
  imagePost,
  date,
  imageUrl,
  userName,
  userId,
  postId,
  currentUserID,
  onOpenComments,
}) => {
  const [isLiked, setIsLiked] = useState(likes.includes(currentUserID));
  const [islikeCount, setIsLikeCount] = useState(likes.length);

  const colors = useThemeColors();
  const { isDarkMode } = useTheme();
  const styles = postComponentStyle(colors);

  const postCreationDateTime = moment(date, 'MM/DD/YYYY hh:mm:ss a');
  const calculatedDateTime = postCreationDateTime.fromNow();

  const liked = async () => {
    try {
      await firestore()
        .collection('UsersData')
        .doc(userId)
        .collection('PostData')
        .doc(postId)
        .update({ like: arrayUnion(currentUserID) })
        .catch(err => {
          throw err;
        });
      setIsLikeCount(prev => prev + 1);
    } catch (error) {
      showMessage({
        message: t(LanguageConstant.error),
        description: t(LanguageConstant.error_message),
        type: 'success',
      });
    }

    console.log('Post Liked');
  };

  const disLiked = async () => {
    try {
      await firestore()
        .collection('UsersData')
        .doc(userId)
        .collection('PostData')
        .doc(postId)
        .update({ like: arrayRemove(currentUserID) })
        .catch(err => {
          throw err;
        });
      setIsLikeCount(prev => prev - 1);
    } catch (error) {
      showMessage({
        message: t(LanguageConstant.error),
        description: t(LanguageConstant.error_message),
        type: 'success',
      });
    }
  };
  return (
    <View style={styles.mainLayoutStyle}>
      <View style={styles.modalStyle}>
        <View style={styles.upperPostStyle}>
          <View style={styles.headerStyle}>
            <View style={styles.titleImageStyle}>
              <Image style={styles.profilePicStyle} src={imageUrl} />
              <View style={styles.nameAndTitleStyle}>
                <Text style={styles.nameStyle}>{userName}</Text>
                <Text style={styles.textStyle}>{title}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.postStyle}>
          <CarouselComponent
            imagePost={imagePost}
            reSizeMethod="resize"
            reSizeMode="contain"
            height={200}
            clickEnable={true}
          />
        </View>
      </View>
      <View style={styles.actionsStyle}>
        <View style={styles.actionBtnStyle}>
          <TouchableOpacity
            onPress={() => {
              setIsLiked(!isLiked);
              isLiked ? disLiked() : liked();
            }}
          >
            {isDarkMode ? (
              isLiked ? (
                <LikedHeart height={24} width={24} />
              ) : (
                <HeartDark height={25} width={25} />
              )
            ) : isLiked ? (
              <LikedHeart height={24} width={24} />
            ) : (
              <Heart />
            )}
          </TouchableOpacity>

          <View style={styles.commentBtnStyle}>
            <TouchableOpacity
              onPress={() => {
                onOpenComments();
              }}
            >
              {isDarkMode ? (
                <CommnetDark height={28} width={28} stroke={colors.text} />
              ) : (
                <Comment />
              )}
            </TouchableOpacity>
          </View>
          {isDarkMode ? <MessageDark height={25} width={25} /> : <Message />}
        </View>
      </View>

      <Text style={styles.likeStyle}>
        {islikeCount + ' ' + t(LanguageConstant.likes)}
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
    textStyle: {
      color: colors.text,
      fontSize: fs(11),
    },
    nameStyle: {
      color: colors.text,
      fontSize: fs(13),
      fontWeight: '600',
    },

    nameAndTitleStyle: {
      justifyContent: 'center',
    },

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
      width: fs(40),
      height: fs(40),
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
