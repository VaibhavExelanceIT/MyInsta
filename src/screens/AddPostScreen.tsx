import {
  FlatList,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import { more } from '../helper/images';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { showMessage } from 'react-native-flash-message';
import { useTranslation } from 'react-i18next';
import { LanguageConstant } from '../constants/language_constants';

const AddPostScreen = ({ route }: any) => {
  const [title, SetTitle] = useState<string>();
  const [desc, SetDesc] = useState<string>();
  const [uri, setUri] = useState<string[]>([]);
  const navigation = useNavigation<any>();

  const { t } = useTranslation();

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();

  const currentUser = auth().currentUser;
  const userId = currentUser ? currentUser.uid : null;

  console.log('🚀 ~ AddPostScreen ~ userId:', userId);

  const DateAndTime = `${day}:${month}:${year}:${hours}:${minutes}`;

  const submitHandler = () => {
    // console.log('🚀 ~ AddPostScreen ~ DateAndTime:', DateAndTime);
    // console.log('🚀 ~ AddPostScreen ~ userId:', userId);
    // console.log('🚀 ~ AddPostScreen ~ title:', title);
    // console.log('🚀 ~ AddPostScreen ~ desc:', desc);
    // console.log('🚀 ~ AddPostScreen ~ uri:', uri);

    if (userId !== null) {
      const usersCollection = firestore()
        .collection('UsersData')
        .doc(userId)
        .collection('PostData');

      usersCollection
        .add({
          Title: title,
          Description: desc,
          PostURL: uri,
          DateAndTime: DateAndTime,
          like: 0,
          comment: 0,
        })
        .then(() => {
          showMessage({
            message: t(LanguageConstant.success),
            description: 'Post Created Successfully....',
            type: 'success',
          });
          navigation.navigate('MyTab', { screen: 'HomeScreen' });
        })
        .catch(error => {
          showMessage({
            type: 'danger',
            message: t(LanguageConstant.error),
            description: `${t(LanguageConstant.error_message)} ${error}`,
          });
          console.log(error);
        });
    } else {
      showMessage({
        message: t(LanguageConstant.error),
        description: t(LanguageConstant.user_not_found),
        type: 'danger',
      });
    }
  };

  const imageGallery = () => {
    setUri([
      'https://images.pexels.com/photos/33106717/pexels-photo-33106717.jpeg?_gl=1*18doh69*_ga*MTk3NDc0NTgxMi4xNzQ3OTk4NTM2*_ga_8JE65Q40S6*czE3NTQzMDExMjMkbzMkZzEkdDE3NTQzMDEyMzEkajM3JGwwJGgw',
      'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?_gl=1*k2m0me*_ga*MTk3NDc0NTgxMi4xNzQ3OTk4NTM2*_ga_8JE65Q40S6*czE3NTQzMDExMjMkbzMkZzEkdDE3NTQzMDE4MzgkajYwJGwwJGgw',
    ]);
  };

  return (
    <View style={styles.mainLayout}>
      <View style={styles.modalstyle}>
        <ScrollView style={styles.scrollview}>
          <Text style={styles.AddPostScreen}>
            {t(LanguageConstant.create_post)}
          </Text>
          <View style={styles.postUploadStyle}>
            {uri.length > 0 ? (
              <FlatList
                data={uri}
                horizontal={true}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <Image style={styles.imgstyle} src={item} alt="image" />
                )}
              />
            ) : (
              <TouchableOpacity
                style={styles.imagepost}
                onPress={() => {
                  imageGallery();
                }}
              >
                <ImageBackground
                  source={more}
                  style={{ height: 60, width: 60 }}
                ></ImageBackground>
                <Text>{t(LanguageConstant.add_image)}</Text>
              </TouchableOpacity>
            )}
          </View>
          <TextInput
            placeholder={t(LanguageConstant.title_placeholder)}
            style={styles.textInputStyle}
            value={title}
            onChangeText={e => SetTitle(e)}
            keyboardType="ascii-capable"
          />
          <TextInput
            placeholder={t(LanguageConstant.description_placeHolder)}
            style={styles.textInputStyle}
            value={desc}
            onChangeText={e => SetDesc(e)}
            numberOfLines={3}
            multiline={true}
          />

          <TouchableOpacity style={styles.btnstyle} onPress={submitHandler}>
            <Text style={styles.textStyle}>{t(LanguageConstant.submit)}</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

export default AddPostScreen;

const styles = StyleSheet.create({
  textStyle: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  btnstyle: {
    marginVertical: 10,
    backgroundColor: '#000000',
    padding: 10,
    borderRadius: 20,
  },
  modalstyle: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 20,
  },
  mainLayout: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  scrollview: {
    margin: 10,
  },
  textInputStyle: {
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  postUploadStyle: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  imagepost: {
    marginVertical: 20,
    marginHorizontal: 10,
    height: 50,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  AddPostScreen: {
    fontSize: 23,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  imgstyle: {
    padding: 10,
    margin: 10,
    height: 200,
    width: 200,
  },
});
