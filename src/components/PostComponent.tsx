import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import moment from 'moment';

import firestore, {
  arrayUnion,
  arrayRemove,
} from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';

import {
  Message,
  HeartDark,
  LikedHeart,
  MessageDark,
  CommnetDark,
} from '../helper/icon';
import { fs } from '../helper/fontSize';
import { Comment } from '../helper/icon';
import { useTheme } from '../hooks/useTheme';
import { ColorProps } from '../constants/color';
import CarouselComponent from './CarouselComponent';
import Heart from '../assets/icons/HeartOutline.svg';
import { useThemeColors } from '../hooks/useThemeColors';
import { getText } from '../constants/language/i18next';

interface PostProp {
  date: string;
  title: string;
  userId: string;
  postId: string;
  imageUrl: string;
  userName: string;
  description: string;
  likes: Array<string>;
  currentUserID: string;
  comment: Array<object>;
  imagePost: Array<string>;
  onOpenComments: () => void;
}

const PostComponent: React.FC<PostProp> = ({
  date,
  likes,
  title,
  userId,
  postId,
  imageUrl,
  userName,
  imagePost,
  description,
  currentUserID,
  onOpenComments,
}) => {
  const [isLiked, setIsLiked] = useState(likes.includes(currentUserID));
  const [likeCount, setLikeCount] = useState(likes.length);

  const colors = useThemeColors();
  const { isDarkMode } = useTheme();

  const styles = postComponentStyle(colors);

  const postCreationDateTime = moment(date, 'MM/DD/YYYY hh:mm:ss a');
  const calculatedDateTime = postCreationDateTime.fromNow();

  const handleLiked = async () => {
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
      setLikeCount(prev => prev + 1);
    } catch (error) {
      showMessage({
        message: getText('error'),
        description: getText('error_message'),
        type: 'success',
      });
    }
  };

  const handleDisliked = async () => {
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
      setLikeCount(prev => prev - 1);
    } catch (error) {
      showMessage({
        message: getText('error'),
        description: getText('error_message'),
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
              isLiked ? handleDisliked() : handleLiked();
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

      <Text style={styles.likeStyle}>{likeCount + ' ' + getText('likes')}</Text>

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
