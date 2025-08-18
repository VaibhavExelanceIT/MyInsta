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
  useColorScheme,
  View,
} from 'react-native';
import React, { useState } from 'react';

import * as Yup from 'yup';
import { Formik } from 'formik';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { showMessage } from 'react-native-flash-message';
import { useTranslation } from 'react-i18next';

import { instadark, instalight, more } from '../helper/images';
import { LanguageConstant } from '../constants/language_constants';
import { ArrayUrl } from '../helper/imagesUrl';
import { SettingMenu, SettingMenuDark } from '../helper/icon';
import { useThemeColors } from '../hooks/useThemeColors';

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is Required'),
});

interface PostType {
  title: string;
  description: string;
}

const AddPostScreen = () => {
  const [uri, setUri] = useState<string[]>([]);
  const navigation = useNavigation<any>();

  const { t } = useTranslation();

  const currentDate = new Date();

  const dateTime =
    currentDate.toLocaleDateString() + ' ' + currentDate.toLocaleTimeString();
  console.log('🚀 ~ AddPostScreen ~ dateTime:', dateTime);

  const currentUser = auth().currentUser;
  const userId = currentUser ? currentUser.uid : null;

  console.log('🚀 ~ AddPostScreen ~ userId:', userId);
  const colors = useThemeColors();

  // const DateAndTime = `${day}:${month}:${year}:${hours}:${minutes}`;

  const submitHandler = (value: PostType) => {
    if (userId !== null) {
      const usersCollection = firestore()
        .collection('UsersData')
        .doc(userId)
        .collection('PostData');

      usersCollection
        .add({
          Title: value.title,
          Description: value.description,
          PostURL: uri,
          DateAndTime: dateTime,
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
  const colorScheme = useColorScheme();

  const imageGallery = () => {
    setUri(ArrayUrl);
  };

  const openDrawer = () => {
    navigation.openDrawer();
  };

  return (
    <View style={[styles.mainLayout, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.sortstyle,
          {
            backgroundColor: colors.background,
            borderBottomColor: colors.modalBorderStyle,
          },
        ]}
      >
        <View style={styles.userIcon}>
          <TouchableOpacity onPress={openDrawer} style={styles.userIcon}>
            {colorScheme === 'light' ? (
              <SettingMenu height={30} width={30} />
            ) : (
              <SettingMenuDark height={30} width={30} />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.logoView}>
          <Image
            style={{ alignSelf: 'center' }}
            source={colorScheme === 'light' ? instadark : instalight}
          />
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.scrollview}>
          <Text style={[styles.AddPostScreen, { color: colors.text }]}>
            {t(LanguageConstant.create_post)}
          </Text>
          <View style={styles.postUploadStyle}>
            {uri.length > 0 ? (
              <FlatList
                data={uri}
                horizontal={true}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <Image
                    style={styles.imgstyle}
                    resizeMode="center"
                    src={item}
                    alt="image"
                  />
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
                <Text style={{ color: colors.text }}>
                  {t(LanguageConstant.add_image)}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <Formik
            initialValues={{
              title: '',
              description: '',
            }}
            onSubmit={values => {
              console.log(values);
              console.log(uri);

              submitHandler(values);
            }}
            validationSchema={validationSchema}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
            }) => (
              <>
                <TextInput
                  placeholder={t(LanguageConstant.title_placeholder)}
                  style={[
                    styles.textInputStyle,
                    { backgroundColor: colors.inputTextBackground },
                  ]}
                  value={values.title}
                  onBlur={handleBlur('title')}
                  onChangeText={handleChange('title')}
                  keyboardType="ascii-capable"
                  placeholderTextColor={colors.placeholderTextColor}
                />

                {errors.title && touched.title && (
                  <Text style={styles.errorText}>{errors.title}</Text>
                )}

                <TextInput
                  placeholder={t(LanguageConstant.description_placeHolder)}
                  style={[
                    styles.textInputStyle,
                    { backgroundColor: colors.inputTextBackground },
                  ]}
                  value={values.description}
                  onBlur={handleBlur('description')}
                  onChangeText={handleChange('description')}
                  numberOfLines={50}
                  multiline={true}
                  placeholderTextColor={colors.placeholderTextColor}
                />

                <TouchableOpacity
                  style={[styles.btnstyle, { backgroundColor: colors.text }]}
                  onPress={() => handleSubmit()}
                >
                  <Text
                    style={[
                      styles.textStyle,
                      {
                        backgroundColor: colors.text,
                        color: colors.background,
                      },
                    ]}
                  >
                    {t(LanguageConstant.submit)}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>
        </ScrollView>
      </View>
    </View>
  );
};

export default AddPostScreen;

const styles = StyleSheet.create({
  textStyle: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '800',
  },
  btnstyle: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 20,
  },
  mainLayout: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  scrollview: {
    margin: 20,
  },
  textInputStyle: {
    borderWidth: 0.5,
    borderRadius: 30,
    paddingLeft: 20,
    padding: 20,
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
    fontSize: 30,
    fontWeight: '600',
    marginBottom: 20,
  },
  imgstyle: {
    padding: 10,
    margin: 10,
    height: 200,
    width: 200,
  },
  sortstyle: {
    flexDirection: 'row',
    paddingTop: 30,
    paddingBottom: 10,
    paddingHorizontal: 10,
    justifyContent: 'space-between',

    borderBottomWidth: 1,

    elevation: 5,
  },
  userIcon: {
    marginBottom: '2%',
    alignSelf: 'flex-end',
  },
  logoView: {
    flex: 1,
    marginHorizontal: 10,
  },
  actionbtn: {
    flexDirection: 'row',
    padding: 10,
  },
  heartstyle: {
    marginHorizontal: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 15,
    fontWeight: '800',
  },
});
