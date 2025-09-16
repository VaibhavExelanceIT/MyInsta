import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import * as Yup from 'yup';
import { t } from 'i18next';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ArrayUrl } from '../helper/imagesUrl';
import { ColorProps } from '../constants/color';
import { useThemeColors } from '../hooks/useThemeColors';
import {
  AddDark,
  AddOutline,
  SettingMenu,
  SettingMenuDark,
} from '../helper/icon';
import { fs } from '../helper/fontSize';
import { useTheme } from '../hooks/useTheme';
import { instadark, instalight } from '../helper/images';
import { LanguageConstant } from '../constants/language_constants';

const validationSchema = Yup.object().shape({
  title: Yup.string().required(t(LanguageConstant.titleRequired)),
});

interface PostType {
  title: string;
  description: string;
}

const AddPostScreen = () => {
  const [uri, setUri] = useState<string[]>([]);

  const { t } = useTranslation();
  const colors = useThemeColors();
  const { isDarkMode } = useTheme();
  const navigation = useNavigation<any>();

  const styles = addPostScreenScreen(colors);

  const currentDate = new Date();

  const dateTime =
    currentDate.toLocaleDateString() + ' ' + currentDate.toLocaleTimeString();

  const currentUser = auth().currentUser;
  const userId = currentUser ? currentUser.uid : null;

  const submitHandler = (value: PostType, resetForm: () => void) => {
    if (userId !== null) {
      const usersCollection = firestore()
        .collection('UsersData')
        .doc(userId)
        .collection('PostData');

      usersCollection
        .add({
          title: value.title,
          description: value.description,
          postURL: uri,
          dateAndTime: dateTime,
          like: [],
          comment: [],
        })
        .then(() => {
          showMessage({
            message: t(LanguageConstant.success),
            description: t(LanguageConstant.postCreatedSuccesfull),
            type: 'success',
          });
          setUri([]);
          resetForm();

          navigation.navigate('MyTab', { screen: 'HomeScreen' });
        })
        .catch(() => {
          showMessage({
            type: 'danger',
            message: t(LanguageConstant.error),
            description: t(LanguageConstant.error_message),
          });
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
    setUri(ArrayUrl);
  };

  const openDrawer = () => {
    navigation.openDrawer();
  };

  return (
    <SafeAreaView style={styles.mainLayout} edges={['top', 'left', 'right']}>
      <View style={styles.sortStyle}>
        <View style={styles.userIcon}>
          <TouchableOpacity onPress={openDrawer} style={styles.userIcon}>
            {isDarkMode ? (
              <SettingMenuDark height={30} width={30} />
            ) : (
              <SettingMenu height={30} width={30} />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.logoView}>
          <Image
            style={styles.imageStyle}
            source={isDarkMode ? instalight : instadark}
          />
        </View>
      </View>
      <View style={styles.viewStyle}>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.addPostScreen}>
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
                    style={styles.imgStyle}
                    resizeMode="center"
                    src={item}
                    alt="image"
                  />
                )}
              />
            ) : (
              <TouchableOpacity style={styles.imagePost} onPress={imageGallery}>
                {isDarkMode ? (
                  <AddDark height={70} width={70} />
                ) : (
                  <AddOutline height={70} width={70} />
                )}
                <Text style={styles.textStyle}>
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
            onSubmit={(values, { resetForm }) => {
              submitHandler(values, resetForm);
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
                  style={styles.textInputStyle}
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
                  style={styles.textInputStyle}
                  value={values.description}
                  onBlur={handleBlur('description')}
                  onChangeText={handleChange('description')}
                  numberOfLines={50}
                  multiline={true}
                  placeholderTextColor={colors.placeholderTextColor}
                />

                <TouchableOpacity
                  style={styles.btnStyle}
                  onPress={() => handleSubmit()}
                >
                  <Text style={[styles.textStyle]}>
                    {t(LanguageConstant.submit)}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default AddPostScreen;

const addPostScreenScreen = (colors: ColorProps) =>
  StyleSheet.create({
    viewStyle: {
      flex: 2,
    },
    imageStyle: {
      alignSelf: 'center',
    },
    textStyle: {
      color: colors.white,
      textAlign: 'center',
      fontSize: fs(15),
      fontWeight: '800',
    },
    btnStyle: {
      backgroundColor: colors.primaryblue,
      marginVertical: 10,
      padding: 10,
      borderRadius: 20,
    },
    mainLayout: {
      backgroundColor: colors.background,
      flex: 1,
      justifyContent: 'flex-start',
    },
    scrollView: {
      margin: 20,
    },
    textInputStyle: {
      backgroundColor: colors.inputTextBackground,
      borderWidth: 0.5,
      borderRadius: 30,
      paddingLeft: 20,
      marginVertical: 10,
    },
    postUploadStyle: {
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
    imagePost: {
      marginVertical: 20,
      marginHorizontal: 10,
      height: 50,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    addPostScreen: {
      fontSize: fs(30),
      fontWeight: '600',
      marginBottom: 20,
      color: colors.text,
    },
    imgStyle: {
      padding: 10,
      margin: 10,
      height: 200,
      width: 200,
    },
    sortStyle: {
      flexDirection: 'row',
      paddingTop: 10,
      paddingBottom: 10,
      paddingHorizontal: 10,
      justifyContent: 'space-between',
      backgroundColor: colors.background,
      borderBottomColor: colors.modalBorderStyle,
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
    errorText: {
      color: 'red',
      fontSize: fs(15),
      fontWeight: '800',
    },
  });
