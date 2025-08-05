import { Image, StyleSheet, Text, TextInput, View } from 'react-native';
import React from 'react';

import Heart from '../assets/icons/HeartOutline.svg';
import Comment from '../assets/icons/comment.svg';
import Message from '../assets/icons/message.svg';
import Save from '../assets/icons/Save.svg';
import More from '../assets/icons/more.svg';
import CarouselComponent from './CarouselComponent';

interface ComponentProp {
  likes: string;
  title: string;
  comment: string;
  description: string;
  ImagePost: Array<string>;
  date?: string;
}

const PostComponent: React.FC<ComponentProp> = props => {
  let { likes, title, description, ImagePost, date, comment } = props || {};

  // const extension = ImagePost?.map(item => {
  //   return item.split('.').pop();
  // });

  // console.log(extension);

  return (
    <View style={styles.MainLayoutStyle}>
      <View style={styles.modalstyle}>
        <View style={styles.upperpoststyle}>
          <View style={styles.Headerstyle}>
            <View style={styles.titleimagestyle}>
              <Image
                style={styles.profilepicstyle}
                src="https://images.pexels.com/photos/33106717/pexels-photo-33106717.jpeg?_gl=1*18doh69*_ga*MTk3NDc0NTgxMi4xNzQ3OTk4NTM2*_ga_8JE65Q40S6*czE3NTQzMDExMjMkbzMkZzEkdDE3NTQzMDEyMzEkajM3JGwwJGgw"
              />
              {/* <Text style={styles.textstyle}>{UserEmail}</Text> */}
            </View>
            <View style={styles.morebtnstyle}>
              <More height={30} width={30} />
            </View>
          </View>
          <Text>{title}</Text>
        </View>
        <View style={styles.PostStyle}>
          <CarouselComponent ImagePost={ImagePost} />
        </View>
      </View>
      <View style={styles.actionsStyle}>
        <View style={styles.actionbtnStyle}>
          <Heart />
          <View style={styles.commentbtnstyle}>
            <Comment />
          </View>
          <Message />
        </View>
        <View style={styles.savebtnstyle}>
          <Save />
        </View>
      </View>

      <Text style={styles.likestyle}>{likes} likes</Text>

      <View style={styles.descriptionstyle}>
        <Text>{description}</Text>
      </View>

      <Text style={styles.viewcommnetstyle}>View all {comment} comments</Text>

      <View style={styles.fotterstyle}>
        <View style={styles.titleimagestyle}>
          {/* <Image
            style={styles.fotterImage}
            source={require('../asset/icon/Ellipse.png')}
          /> */}
          <TextInput
            style={styles.commnettextStyle}
            placeholder="Add a comment..."
            keyboardType="ascii-capable"
          />
        </View>

        <View style={styles.morebtnstyle}>
          {/* <Image
            style={styles.emojistyle}
            source={require('../asset/icon/heartEmoji.png')}
          />
          <Image
            style={styles.emojistyle}
            source={require('../asset/icon/hurrayEmoji.png')}
          />
          <Image
            style={styles.emojistyle}
            source={require('../asset/icon/addnew.png')}
          /> */}
        </View>
      </View>
      <Text style={styles.fotterstyle}>{date?.replaceAll(':', '-')}</Text>
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
    color: '#757575',
  },
  fotterstyle: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  viewcommnetstyle: {
    paddingHorizontal: 20,
    color: '#757575',
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
    flex: 0.2,
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
    // flex: 1,
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
  flatliststyle: { backgroundColor: '#111111' },
  descriptionstyle: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  videostyle: { height: '100%' },
  modalstyle: {
    borderBottomWidth: 1,
    borderColor: '#D9D9D9',
    backgroundColor: '#ffffff',
  },
  MainLayoutStyle: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#D9D9D9',
  },
  Headerstyle: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  PostStyle: {
    height: 200,
  },

  userIcon: {
    width: 40,
    height: 40,
    borderRadius: 30,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    backgroundColor: '#D9D9D9',
  },
});
