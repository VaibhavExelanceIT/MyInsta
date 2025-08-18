import { Image, StyleSheet, Text, useColorScheme, View } from 'react-native';
import React from 'react';

import Heart from '../assets/icons/HeartOutline.svg';
import Comment from '../assets/icons/comment.svg';
import Message from '../assets/icons/message.svg';
import Save from '../assets/icons/Save.svg';
import More from '../assets/icons/more.svg';
import CarouselComponent from './CarouselComponent';
import { colors } from '../hooks/useThemeColors';
import { CommnetDark, HeartDark, MessageDark, SaveDark } from '../helper/icon';
import moment from 'moment';

interface ComponentProp {
  likes: number;
  title: string;
  comment: number;
  description: string;
  imagePost: Array<string>;
  date: string;
}

const PostComponent: React.FC<ComponentProp> = props => {
  let { likes, title, description, imagePost, date, comment } = props || {};

  const pastDate = moment(date, 'MM/DD/YYYY hh:mm:ss a');
  const postData = pastDate.fromNow();

  const colorScheme = useColorScheme();
  return (
    <View
      style={[
        styles.MainLayoutStyle,
        {
          borderColor: colors.modalBorderStyle,
          backgroundColor: colors.background,
        },
      ]}
    >
      <View
        style={[
          styles.modalstyle,
          {
            borderColor: colors.modalBorderStyle,
          },
        ]}
      >
        <View style={styles.upperpoststyle}>
          <View style={styles.Headerstyle}>
            <View style={styles.titleimagestyle}>
              <Image
                style={styles.profilepicstyle}
                src="https://images.pexels.com/photos/33106717/pexels-photo-33106717.jpeg?_gl=1*18doh69*_ga*MTk3NDc0NTgxMi4xNzQ3OTk4NTM2*_ga_8JE65Q40S6*czE3NTQzMDExMjMkbzMkZzEkdDE3NTQzMDEyMzEkajM3JGwwJGgw"
              />
            </View>
            <View style={styles.morebtnstyle}>
              <More height={30} width={30} stroke={colors.text} />
            </View>
          </View>
          <Text style={{ color: colors.text }}>{title}</Text>
        </View>
        <View style={styles.PostStyle}>
          <CarouselComponent imagePost={imagePost} />
        </View>
      </View>
      <View style={styles.actionsStyle}>
        <View style={styles.actionbtnStyle}>
          {colorScheme === 'light' ? (
            <Heart />
          ) : (
            <HeartDark height={25} width={25} />
          )}
          <View style={styles.commentbtnstyle}>
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
        <View style={styles.savebtnstyle}>
          {colorScheme === 'light' ? (
            <Save />
          ) : (
            <SaveDark height={30} width={30} />
          )}
        </View>
      </View>

      <Text style={[styles.likestyle, { color: colors.text }]}>
        {likes} likes
      </Text>

      {description && (
        <View style={styles.descriptionstyle}>
          <Text style={{ color: colors.text }}>{description}</Text>
        </View>
      )}
      {/* <Text>{postData}</Text> */}
      <Text style={[styles.fotterstyle, { color: colors.text }]}>
        {postData}
      </Text>
    </View>
  );
};

export default PostComponent;

const styles = StyleSheet.create({
  commenttextinput: { flex: 0.5 },
  emojistyle: {
    height: 15,
    width: 15,
  },
  fotterImage: {
    borderRadius: 50,
    height: 30,
    width: 30,
    marginRight: 10,
    marginTop: 5,
  },
  commnettextStyle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 5,
  },
  fotterstyle: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  viewcommnetstyle: {
    paddingHorizontal: 20,

    fontSize: 12,
    fontWeight: '600',
    paddingBottom: 10,
  },
  likestyle: {
    paddingHorizontal: 20,
    fontSize: 14,
    fontWeight: '700',
    paddingTop: 10,
  },
  morebtnstyle: {
    marginTop: 15,

    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  profilepicstyle: {
    borderRadius: 50,
    height: 40,
    width: 40,
    marginRight: 10,
  },
  textstyle: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 10,
  },
  titleimagestyle: {
    flex: 0.7,
    flexDirection: 'row',
  },
  commentbtnstyle: {
    marginHorizontal: 10,
  },
  savebtnstyle: {
    flex: 1,
    alignItems: 'flex-end',
  },
  actionbtnStyle: {
    flexDirection: 'row',
    flex: 0.1,
    justifyContent: 'space-between',
  },
  actionsStyle: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  upperpoststyle: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  descriptionstyle: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  videostyle: { height: '100%' },
  modalstyle: {
    borderBottomWidth: 1,
  },
  MainLayoutStyle: {
    flex: 1,
    borderBottomWidth: 1,
  },
  Headerstyle: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  PostStyle: {
    height: 200,
  },
});
