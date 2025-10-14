import React, { useState } from 'react';
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

import { Formik } from 'formik';
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
import { getText } from '../constants/language/i18next';
import { instadark, instalight } from '../helper/images';

interface PostType {
  title: string;
  description: string;
}

const AddPostScreen = () => {
  const [uri, setUri] = useState<string[]>([]);
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const colors = useThemeColors();
  const { isDarkMode } = useTheme();
  const navigation = useNavigation<any>();

  const styles = addPostScreenScreen(colors);

  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');

  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  const seconds = String(currentDate.getSeconds()).padStart(2, '0');

  const dateTime = `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
  console.log(dateTime);

  const currentUser = auth().currentUser;
  const userId = currentUser ? currentUser.uid : null;

  const validationSchema = Yup.object().shape({
    title: Yup.string().required(getText('titleRequired')),
  });

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
            message: getText('success'),
            description: getText('postCreatedSuccesfull'),
            type: 'success',
          });
          setUri([]);
          resetForm();

          navigation.navigate('MyTab', { screen: 'HomeScreen' });
        })
        .catch(() => {
          showMessage({
            type: 'danger',
            message: getText('error'),
            description: getText('error_message'),
          });
        });
    } else {
      showMessage({
        message: getText('error'),
        description: getText('user_not_found'),
        type: 'danger',
      });
    }
  };

  const imageGallery = () => {
    setIsClicked(false);
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
          <Text style={styles.addPostScreen}>{getText('create_post')}</Text>
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
                <Text style={styles.textStyle}>{getText('add_image')}</Text>
              </TouchableOpacity>
            )}
          </View>
          {isClicked && (
            <Text style={styles.errorText}>
              {getText('atleastOneImageRequired')}
            </Text>
          )}

          <Formik
            initialValues={{
              title: '',
              description: '',
            }}
            onSubmit={(values, { resetForm }) => {
              uri.length == 0
                ? setIsClicked(true)
                : submitHandler(values, resetForm);
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
                  placeholder={getText('title_placeholder')}
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
                  placeholder={getText('description_placeHolder')}
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
                  <Text style={[styles.textStyle]}>{getText('submit')}</Text>
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
      fontSize: fs(15),
      fontWeight: '800',
      color: colors.white,
      textAlign: 'center',
    },
    btnStyle: {
      padding: 10,
      borderRadius: 20,
      marginVertical: 10,
      backgroundColor: colors.primaryblue,
    },
    mainLayout: {
      flex: 1,
      justifyContent: 'flex-start',
      backgroundColor: colors.background,
    },
    scrollView: {
      margin: 20,
    },
    textInputStyle: {
      paddingLeft: 20,
      borderWidth: 0.5,
      borderRadius: 30,
      marginVertical: 10,
      backgroundColor: colors.inputTextBackground,
    },
    postUploadStyle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    imagePost: {
      flex: 1,
      height: 50,
      marginVertical: 20,
      alignItems: 'center',
      marginHorizontal: 10,
      justifyContent: 'center',
    },
    addPostScreen: {
      fontSize: fs(30),
      fontWeight: '600',
      marginBottom: 20,
      color: colors.text,
    },
    imgStyle: {
      margin: 10,
      width: 200,
      padding: 10,
      height: 200,
    },
    sortStyle: {
      elevation: 5,
      paddingTop: 10,
      paddingBottom: 10,
      flexDirection: 'row',
      borderBottomWidth: 1,
      paddingHorizontal: 10,
      justifyContent: 'space-between',
      backgroundColor: colors.background,
      borderBottomColor: colors.modalBorderStyle,
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
