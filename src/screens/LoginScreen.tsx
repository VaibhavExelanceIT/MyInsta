import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  Modal,
  Image,
  Alert,
  StyleSheet,
  I18nManager,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import * as Yup from 'yup';
import { t } from 'i18next';
import { useFormik } from 'formik';
import {
  getAuth,
  firebase,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
} from '@react-native-firebase/auth';
import RNRestart from 'react-native-restart';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import firestore from '@react-native-firebase/firestore';
import DropDownPicker from 'react-native-dropdown-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import InputText from '../components/InputText';
import i18n from '../constants/language/i18next';
import { ColorProps } from '../constants/color';
import { useThemeColors } from '../hooks/useThemeColors';
import ButtonComponent from '../components/ButtonComponent';
import { LanguageConstant } from '../constants/language_constants';
import { instadark, instalight, googlelogo } from '../helper/images';
import { fs } from '../helper/fontSize';
import { CrossLight } from '../helper/icon';
import LoaderComponent from '../components/LoaderComponent';
import { useTheme } from '../hooks/useTheme';

let validationSchema = Yup.object().shape({
  email: Yup.string()
    .required(t(LanguageConstant.email_required))
    .email(t(LanguageConstant.email_error)),
  password: Yup.string()
    .label(t(LanguageConstant.password))
    .required(t(LanguageConstant.password_required))
    .matches(/\d/, t(LanguageConstant.password_must_number))
    .matches(/\w*[a-z]\w*/, t(LanguageConstant.password_must_small))
    .matches(/\w*[A-Z]\w*/, t(LanguageConstant.password_must_capital)),
});
interface UserType {
  email: string;
  password: string;
}

const LoginScreen = () => {
  const [items, setItems] = useState([
    { label: t(LanguageConstant.english), value: 'en' },
    { label: t(LanguageConstant.hindi), value: 'hi' },
    { label: t(LanguageConstant.urdu), value: 'ar' },
  ]);
  const [value, setValue] = useState<any>();
  const [isOpen, setIsOpen] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { isDarkMode } = useTheme();

  const auth = getAuth();
  const colors = useThemeColors();

  const navigation = useNavigation<any>();
  const styles = loginScreenStyle(colors);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '956857887247-jttn9l0vhgdgabp27o8634sg2uvmc0d0.apps.googleusercontent.com',
      iosClientId:
        '956857887247-fv38un1ht58puru0atl6vio70dabj7t6.apps.googleusercontent.com',
    });

    const user = auth.currentUser;
    if (user) {
      navigation.navigate('DrawerNavigation');
    }
  }, []);

  isDarkMode
    ? DropDownPicker.setTheme('DARK')
    : DropDownPicker.setTheme('LIGHT');

  const changeLanguage = async (language: string) => {
    try {
      await i18n.changeLanguage(language);
      await AsyncStorage.setItem('user-language', language);

      const isRTL = language === 'ar';
      if (I18nManager.isRTL !== isRTL) {
        I18nManager.forceRTL(isRTL);
      }
      RNRestart.Restart();
    } catch (error) {
      Alert.alert('Error while changing language');
    }
  };
  const googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      setIsLoading(true);
      setIsModalVisible(true);
      const signInResult = await GoogleSignin.signIn();

      let idToken: any = signInResult.data?.idToken;
      if (!idToken) {
        throw new Error('No ID token found');
      }
      const googleCredential = GoogleAuthProvider.credential(
        signInResult?.data?.idToken,
      );

      const userEmail = signInResult?.data?.user?.email;

      const isUserPresent = await firestore()
        .collection('UsersData')
        .where('email', '==', userEmail)
        .get();

      if (!isUserPresent.empty) {
        navigation.navigate('DrawerNavigation', { email: userEmail });
      } else {
        navigation.navigate('UserDetailsScreeen', { email: userEmail });
      }

      setIsLoading(false);
      setIsModalVisible(false);
      return signInWithCredential(getAuth(), googleCredential);
    } catch (error) {
      setIsLoading(false);
      setIsModalVisible(false);
      showMessage({
        message: t(LanguageConstant.error),
        description: `${t(LanguageConstant.error_message)} ${error}`,
        type: 'danger',
      });
    }
  };

  const userSignIn = async (values: UserType) => {
    const isUserPresent = await firestore()
      .collection('UsersData')
      .where('email', '==', values.email)
      .get();

    try {
      await signInWithEmailAndPassword(
        getAuth(),
        values.email,
        values.password,
      );

      if (!isUserPresent.empty) {
        showMessage({
          message: t(LanguageConstant.success),
          description: t(LanguageConstant.logged_in_message),
          type: 'success',
        });
        navigation.navigate('DrawerNavigation', { email: values.email });
      } else {
        showMessage({
          message: t(LanguageConstant.success),
          description: t(LanguageConstant.enterUserDetails),
          type: 'warning',
        });
        navigation.navigate('UserDetailsScreeen', { email: values.email });
      }
      setIsModalVisible(false);
      setIsLoading(false);
    } catch (error) {
      setIsModalVisible(false);
      setIsLoading(false);
      showMessage({
        message: t(LanguageConstant.error),
        description: t(LanguageConstant.email_password_error),
        type: 'danger',
      });
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await firebase.auth().sendPasswordResetEmail(email);
      Alert.alert('Email Send Successfully....');
    } catch (error: any) {
      if (error.message === 'Firebase: Error (auth/user-not-found).') {
        Alert.alert('There is no user corresponding to this email address.');
      } else if (error.Code === 'auth/invalid-email') {
        Alert.alert(error);
      }
      Alert.alert(error.message);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: 'vai@gmail.com',
      password: 'Vai@123456',
    },

    onSubmit: values => {
      setIsLoading(true);
      setIsModalVisible(true);
      userSignIn(values);
    },
    validationSchema,
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.dropDownView}>
        <DropDownPicker
          open={isOpen}
          value={value}
          items={items}
          setOpen={setIsOpen}
          setValue={setValue}
          setItems={setItems}
          showBadgeDot={true}
          itemSeparator={true}
          placeholder={t(LanguageConstant.selectedLanguage)}
          style={styles.dropDownStyle}
          onChangeValue={e => changeLanguage(e)}
          containerStyle={[styles.dropDownContainer]}
        />
      </View>

      <ScrollView style={styles.scrollViewStyle}>
        <View style={styles.logoView}>
          <View style={styles.logoView}>
            <Image source={isDarkMode ? instalight : instadark} />
          </View>
          <Text style={styles.textDarkStyle}>
            {t(LanguageConstant.loginForm)}
          </Text>
        </View>

        <View style={styles.formView}>
          <>
            <InputText
              value={formik.values.email}
              onBlur={formik.handleBlur('email')}
              onChange={formik.handleChange('email')}
              placeholder={t(LanguageConstant.email)}
            />
            {formik.errors.email && formik.touched.email && (
              <Text style={styles.errorText}>{formik.errors.email}</Text>
            )}
            <InputText
              value={formik.values.password}
              onBlur={formik.handleBlur('password')}
              onChange={formik.handleChange('password')}
              placeholder={t(LanguageConstant.password)}
            />
            {formik.errors.password && formik.touched.password && (
              <Text style={styles.errorText}>{formik.errors.password}</Text>
            )}
            <TouchableOpacity
              style={styles.forgetButtonStyle}
              onPress={() => setIsModalVisible(true)}
            >
              <Text style={styles.forgetTextStyle}>
                {t(LanguageConstant.forgetPassword)}
              </Text>
            </TouchableOpacity>
            <ButtonComponent
              title={t(LanguageConstant.login)}
              onClick={formik.handleSubmit}
              btnStyle={styles.btnStyle}
              textStyle={styles.textStyle}
            />
          </>

          <View style={styles.signUpView}>
            <Text style={styles.text}>
              {t(LanguageConstant.doNotHaveAccount)}
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('SignupScreen');
              }}
            >
              <Text style={styles.signUpStyle}>
                {t(LanguageConstant.signup)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.googleView}>
          <View style={styles.dashStyle} />
          <Text style={styles.orStyle}>{t(LanguageConstant.or)}</Text>
          <View style={styles.dashStyle} />
        </View>

        <View style={styles.socialView}>
          <View style={styles.socialLogoView}>
            <TouchableOpacity onPress={() => googleSignIn()}>
              <Image style={styles.socialLogo} source={googlelogo} />
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          transparent={true}
          animationType="slide"
          visible={isModalVisible}
          onRequestClose={() => {
            setIsModalVisible(false);
          }}
        >
          {isLoading ? (
            <LoaderComponent
              isLoading={isLoading}
              isModalVisible={isModalVisible}
            />
          ) : (
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <>
                  <TouchableOpacity
                    onPress={() => setIsModalVisible(false)}
                    style={styles.btnCloseStyle}
                  >
                    <CrossLight height={20} width={20} />
                  </TouchableOpacity>
                  <InputText
                    placeholder={t(LanguageConstant.email)}
                    value={formik.values.email}
                    onChange={formik.handleChange('email')}
                    onBlur={formik.handleBlur('email')}
                  />
                  {formik.errors.email && formik.touched.email && (
                    <Text style={styles.errorText}>{formik.errors.email}</Text>
                  )}

                  <TouchableOpacity
                    style={[styles.button]}
                    onPress={() => formik.handleSubmit()}
                  >
                    <Text style={styles.textStyle}>
                      {t(LanguageConstant.submit)}
                    </Text>
                  </TouchableOpacity>
                </>
              </View>
            </View>
          )}
        </Modal>
      </ScrollView>
      <View style={styles.textViewStyle}>
        <Text style={styles.textStyleFrom}>{t(LanguageConstant.from)}</Text>
        <Text style={styles.textStyleFacebook}>
          {t(LanguageConstant.facebook)}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const loginScreenStyle = (colors: ColorProps) =>
  StyleSheet.create({
    scrollViewStyle: {
      marginTop: 40,
    },
    textStyleFrom: {
      fontSize: fs(14),
      fontWeight: '600',
      color: colors.fromcolor,
    },
    textStyleFacebook: {
      fontSize: fs(16),
      fontWeight: '400',
      color: colors.text,
    },
    textViewStyle: { alignItems: 'center' },
    socialLogoView: {
      margin: 20,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    socialView: {
      flex: 2,
      justifyContent: 'space-between',
    },
    socialLogo: { height: 30, width: 30, marginHorizontal: 10 },
    orStyle: { flex: 0.6, textAlign: 'center', color: colors.text },

    dashStyle: {
      flex: 1,
      height: 0,
      marginTop: 10,
      borderWidth: 0.8,
      borderColor: colors.dashcolor,
    },
    signUpView: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginVertical: 20,
    },
    signUpStyle: { fontWeight: '700', color: colors.primaryblue },
    forgetTextStyle: {
      color: colors.primaryblue,
      fontSize: fs(13),
      fontWeight: '700',
      marginVertical: 10,
    },
    forgetButtonStyle: { alignSelf: 'flex-end' },
    dropDownStyle: { borderWidth: 1 },
    googleView: {
      alignSelf: 'center',
      flexDirection: 'row',
      paddingHorizontal: 50,
    },
    formView: {
      flex: 2,
      paddingHorizontal: 50,
    },
    logoView: {
      alignSelf: 'center',
      marginBottom: 20,
    },
    dropDownContainer: {
      flex: 1,
      width: '35%',
      borderWidth: 0,
      alignSelf: 'center',
    },
    dropDownView: {
      flex: 0.7,
      alignItems: 'center',
    },

    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    text: {
      color: colors.text,
    },
    errorText: {
      color: 'red',
      fontSize: fs(13),
      fontWeight: '800',
    },

    centeredView: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
      padding: 30,
      elevation: 5,
      width: '90%',
      maxWidth: '90%',
      shadowRadius: 4,
      borderRadius: 20,
      shadowOpacity: 0.25,
      shadowColor: colors.black,
      backgroundColor: colors.white,
      shadowOffset: {
        width: 0,
        height: 2,
      },
    },
    title: {
      padding: 10,
      borderWidth: 1,
      borderRadius: 10,
      marginVertical: 10,
    },
    button: {
      padding: 10,
      elevation: 2,
      borderRadius: 20,
      marginVertical: 10,
      backgroundColor: colors.primaryblue,
    },
    textStyle: {
      fontWeight: '500',
      textAlign: 'center',
      color: colors.white,
    },
    btnStyle: {
      padding: 10,
      borderRadius: 6,
      backgroundColor: colors.primaryblue,
    },
    textDarkStyle: {
      fontSize: fs(30),
      fontWeight: '600',
      textAlign: 'center',
      color: colors.text,
      textDecorationLine: 'underline',
      textDecorationColor: colors.text,
    },
    btnCloseStyle: {
      borderWidth: 1,
      borderRadius: 5,
      alignSelf: 'flex-end',
      borderColor: colors.listBackgroundColor,
      backgroundColor: colors.commentTextStyle,
    },
  });
