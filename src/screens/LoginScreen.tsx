import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  Modal,
  Image,
  Alert,
  ScrollView,
  StyleSheet,
  I18nManager,
  TouchableOpacity,
} from 'react-native';

import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  getAuth,
  firebase,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
} from '@react-native-firebase/auth';
import RNRestart from 'react-native-restart';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import firestore from '@react-native-firebase/firestore';
import DropDownPicker from 'react-native-dropdown-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { fs } from '../helper/fontSize';
import { CrossLight } from '../helper/icon';
import { useTheme } from '../hooks/useTheme';
import { ColorProps } from '../constants/color';
import InputText from '../components/InputText';
import { useFCMToken } from '../hooks/useFCMToken';
import { getText } from '../constants/language/i18next';
import { useThemeColors } from '../hooks/useThemeColors';
import ButtonComponent from '../components/ButtonComponent';
import LoaderComponent from '../components/LoaderComponent';
import { instadark, instalight, googlelogo } from '../helper/images';

const getSchemas = () => {
  const email = Yup.string()
    .email(getText('email_error'))
    .required(getText('email_required'));

  const password = Yup.string().required(getText('password_required'));

  return {
    loginValidationSchema: Yup.object({ email, password }),
    forgetValidationSchema: Yup.object({ email }),
  };
};

interface UserType {
  email: string;
  password: string;
}

const LoginScreen = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(getText('English'));

  const [items, setItems] = useState([
    { label: getText('english'), value: 'en' },
    { label: getText('hindi'), value: 'hi' },
    { label: getText('urdu'), value: 'ar' },
  ]);
  const [schemas, setSchemas] = useState(getSchemas());

  const [value, setValue] = useState<any>();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { isDarkMode } = useTheme();
  const token = useFCMToken();
  const colors = useThemeColors();
  const navigation = useNavigation<any>();
  const styles = loginScreenStyle(colors);
  const auth = getAuth();
  const { i18n } = useTranslation();

  useEffect(() => {
    const fetchdata = async () => {
      const jsonValue = await AsyncStorage.getItem('user-language');

      items.find(cv => {
        if (cv.value === jsonValue) {
          setSelectedLanguage(cv.label);
          setValue(cv.value);
        }
      });
    };

    fetchdata();
    const handleLanguageChange = () => {
      const newSchemas = getSchemas();
      setSchemas(newSchemas);

      formik.resetForm({ values: formik.values });
      formikForgetPassword.resetForm({ values: formik.values });
    };

    i18n.on('languageChanged', handleLanguageChange);
    return () => i18n.off('languageChanged', handleLanguageChange);
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
        RNRestart.Restart();
      }
    } catch (error) {
      Alert.alert('Error while changing language');
    }
  };

  const getID = async (id?: string) => {
    const user = auth.currentUser;

    id == null ? user && storeToken(user?.uid) : storeToken(id);
  };

  const storeToken = async (id: string) => {
    await firestore().collection('UsersData').doc(id).update({ token: token });
  };

  const googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      setIsLoading(true);
      setIsModalVisible(true);
      const signInResult = await GoogleSignin.signIn();
      console.log('🚀 ~ googleSignIn ~ signInResult:', signInResult);

      let idToken: any = signInResult.data?.idToken;
      console.log('🚀 ~ googleSignIn ~ idToken:', idToken);

      if (!idToken) {
        throw new Error('No ID token found');
      }
      const googleCredential = GoogleAuthProvider.credential(
        signInResult?.data?.idToken,
      );
      console.log('🚀 ~ googleSignIn ~ googleCredential:', googleCredential);

      const userEmail = signInResult?.data?.user?.email;
      console.log('🚀 ~ googleSignIn ~ userEmail:', userEmail);

      const isUserPresent = await firestore()
        .collection('UsersData')
        .where('email', '==', userEmail)
        .get();

      setIsLoading(false);
      setIsModalVisible(false);
      signInWithCredential(getAuth(), googleCredential);

      if (!isUserPresent.empty) {
        getID(isUserPresent.docs[0].id);
        navigation.replace('DrawerNavigation', { email: userEmail });
      } else {
        navigation.navigate('UserDetailsScreeen', { email: userEmail });
      }
    } catch (error) {
      console.log('🚀 ~ googleSignIn ~ error:', error);
      setIsLoading(false);
      setIsModalVisible(false);
      showMessage({
        message: getText('error'),
        description: `${getText('error_message')} ${error}`,
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
      if (!isUserPresent.empty) {
        showMessage({
          message: getText('success'),
          description: getText('logged_in_message'),
          type: 'success',
        });
        await signInWithEmailAndPassword(
          getAuth(),
          values.email,
          values.password,
        );
        navigation.replace('DrawerNavigation', { email: values.email });
      } else {
        showMessage({
          message: getText('error'),
          description: `${getText('user_not_found')}\n${getText(
            'userRegisterMessage',
          )} `,
          type: 'danger',
        });
        navigation.navigate('SignupScreen');
      }
      getID();

      setIsModalVisible(false);
      setIsLoading(false);
      getID();
    } catch (error) {
      setIsModalVisible(false);
      setIsLoading(false);
      showMessage({
        message: getText('error'),
        description: getText('email_password_error'),
        type: 'danger',
      });
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await firebase.auth().sendPasswordResetEmail(email);
      showMessage({
        message: getText('success'),
        description: getText('emailSendMessage'),
        type: 'success',
      });
    } catch (error: any) {
      if (error.message === 'Firebase: Error (auth/user-not-found).') {
        showMessage({
          message: getText('error'),
          description: getText('noEmailFound'),
          type: 'danger',
        });
      } else if (error.code === 'auth/invalid-email') {
        showMessage({
          message: getText('error'),
          description: getText('email_error'),
          type: 'danger',
        });
      }
      showMessage({
        message: getText('error'),
        description: `There is some Error ${error.message}`,
        type: 'danger',
      });
    } finally {
      setIsLoading(false);
      setIsModalVisible(false);
    }
  };

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: schemas.loginValidationSchema,
    onSubmit: values => {
      setIsLoading(true);
      setIsModalVisible(true);
      userSignIn(values);
    },
  });

  const formikForgetPassword = useFormik({
    initialValues: { email: '' },
    validationSchema: schemas.forgetValidationSchema,
    onSubmit: values => {
      setIsLoading(true);
      setIsModalVisible(true);
      resetPassword(values.email);
    },
  });

  return (
    <SafeAreaView style={styles.container}>
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
          placeholder={selectedLanguage}
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
          <Text style={styles.textDarkStyle}>{getText('loginForm')}</Text>
        </View>

        <View style={styles.formView}>
          <>
            <InputText
              value={formik.values.email}
              onBlur={formik.handleBlur('email')}
              onChange={formik.handleChange('email')}
              placeholder={getText('email')}
            />
            {formik.errors.email && formik.touched.email && (
              <Text style={styles.errorText}>{formik.errors.email}</Text>
            )}
            <InputText
              value={formik.values.password}
              onBlur={formik.handleBlur('password')}
              onChange={formik.handleChange('password')}
              placeholder={getText('password')}
              isPassword={true}
            />

            {formik.errors.password && formik.touched.password && (
              <Text style={styles.errorText}>{formik.errors.password}</Text>
            )}
            <TouchableOpacity
              style={styles.forgetButtonStyle}
              onPress={() => setIsModalVisible(true)}
            >
              <Text style={styles.forgetTextStyle}>
                {getText('forgetPassword')}
              </Text>
            </TouchableOpacity>
            <ButtonComponent
              title={getText('login')}
              onClick={formik.handleSubmit}
              btnStyle={styles.btnStyle}
              textStyle={styles.textStyle}
            />
          </>

          <View style={styles.signUpView}>
            <Text style={styles.text}>{getText('doNotHaveAccount')}</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('SignupScreen');
              }}
            >
              <Text style={styles.signUpStyle}>{getText('signup')}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.googleView}>
          <View style={styles.dashStyle} />
          <Text style={styles.orStyle}>{getText('or')}</Text>
          <View style={styles.dashStyle} />
        </View>

        <View style={styles.socialView}>
          <View style={styles.socialLogoView}>
            <TouchableOpacity onPress={() => googleSignIn()}>
              <Image style={styles.socialLogo} source={googlelogo} />
            </TouchableOpacity>
          </View>
        </View>
        {/* ================================================================================ */}
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
                    placeholder={getText('email')}
                    value={formikForgetPassword.values.email}
                    onChange={formikForgetPassword.handleChange('email')}
                    onBlur={formikForgetPassword.handleBlur('email')}
                  />
                  {formikForgetPassword.errors.email &&
                    formikForgetPassword.touched.email && (
                      <Text style={styles.errorText}>
                        {formikForgetPassword.errors.email}
                      </Text>
                    )}

                  <TouchableOpacity
                    style={[styles.button]}
                    onPress={() => formikForgetPassword.handleSubmit()}
                  >
                    <Text style={styles.textStyle}>{getText('submit')}</Text>
                  </TouchableOpacity>
                </>
              </View>
            </View>
          )}
        </Modal>
      </ScrollView>
      <View style={styles.textViewStyle}>
        <Text style={styles.textStyleFrom}>{getText('from')}</Text>
        <Text style={styles.textStyleFacebook}>{getText('facebook')}</Text>
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
      color: colors.declineBtnStyle,
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
