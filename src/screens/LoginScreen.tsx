import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  Modal,
  Image,
  Alert,
  StyleSheet,
  I18nManager,
  useColorScheme,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  getAuth,
  firebase,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from '@react-native-firebase/auth';
import RNRestart from 'react-native-restart';

import { t } from 'i18next';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import DropDownPicker from 'react-native-dropdown-picker';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import i18n from '../constants/language/i18next';
import { LanguageConstant } from '../constants/language_constants';
import {
  instadark,
  instalight,
  googlelogo,
  microsoftlogo,
} from '../helper/images';
import InputText from '../components/InputText';
import ButtonComponent from '../components/ButtonComponent';
import { useThemeColors } from '../hooks/useThemeColors';

const validationSchema = Yup.object().shape({
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
interface usertype {
  email: string;
  password: string;
}

const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState<boolean>(true);

  const colors = useThemeColors();

  useEffect(() => {
    if (loading) {
      <ActivityIndicator size={'large'} />;
    }
    GoogleSignin.configure({
      webClientId:
        '956857887247-jttn9l0vhgdgabp27o8634sg2uvmc0d0.apps.googleusercontent.com',
      iosClientId:
        '956857887247-fv38un1ht58puru0atl6vio70dabj7t6.apps.googleusercontent.com',
    });

    const auth = getAuth();

    const user = auth.currentUser;
    if (user) {
      navigation.navigate('DrawerNavigation');
      console.log('User is logged in:', user.email);
    } else {
      console.log('User is not logged in.');
    }
    setLoading(!loading);
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<any>();
  const [items, setItems] = useState([
    { label: t(LanguageConstant.english), value: 'en' },
    { label: t(LanguageConstant.hindi), value: 'hi' },
    { label: t(LanguageConstant.urdu), value: 'ar' },
  ]);

  const colorScheme = useColorScheme();

  colorScheme === 'dark'
    ? DropDownPicker.setTheme('DARK')
    : DropDownPicker.setTheme('LIGHT');

  const changeLanguage = () => {
    i18n
      .changeLanguage(value)
      .then(() => {
        console.log(value);
        RNRestart.Restart();
        I18nManager.forceRTL(i18n.language === 'ar');
      })
      .catch(() => {
        showMessage({
          message: t(LanguageConstant.error),
          description: t(LanguageConstant.language_change_error_message),
          type: 'danger',
        });
        console.log('something went wrong while applying RTL');
      });
  };

  const googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const signInResult = await GoogleSignin.signIn();
      let idToken: any = signInResult.data?.idToken;
      console.log('🚀 ~ googleSignIn ~ idToken:', idToken);
      if (!idToken) {
        throw new Error('No ID token found');
      }
      const googleCredential = GoogleAuthProvider.credential(
        signInResult?.data?.idToken,
      );
      console.log('🚀 ~ googleSignIn ~ googleCredential:', googleCredential);
      const useremail = signInResult?.data?.user?.email;
      console.log(signInResult);
      showMessage({
        message: t(LanguageConstant.success),
        description: t(LanguageConstant.logged_in_message),
        type: 'success',
      });
      navigation.navigate('DrawerNavigation', { email: useremail });
    } catch (error) {
      showMessage({
        message: t(LanguageConstant.error),
        description: `${t(LanguageConstant.error_message)} ${error}`,
        type: 'danger',
      });
      console.log(error);
    }
  };

  const userSignIn = (values: usertype) => {
    signInWithEmailAndPassword(getAuth(), values.email, values.password)
      .then(() => {
        showMessage({
          message: t(LanguageConstant.success),
          description: t(LanguageConstant.logged_in_message),
          type: 'success',
        });
        console.log(values.email);
        navigation.navigate('DrawerNavigation', { email: values.email });
      })
      .catch(() => {
        showMessage({
          message: t(LanguageConstant.error),
          description: t(LanguageConstant.email_password_error),
          type: 'danger',
        });

        console.log('user not found');
      });
  };

  const resetPassword = async (email: string) => {
    await firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        Alert.alert('Email Send Successfully....');
      })
      .catch(error => {
        if (error.message === 'Firebase: Error (auth/user-not-found).') {
          Alert.alert('There is no user corresponding to this email address.');
        } else if (error.Code === 'auth/invalid-email') {
          Alert.alert(error);
        }
        Alert.alert(error.message);
      });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.dropdownView}>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          showBadgeDot={true}
          itemSeparator={true}
          placeholder={'English'}
          style={styles.dropdownstyle}
          onChangeValue={() => changeLanguage()}
          containerStyle={[styles.dropdowncontainer]}
        />
      </View>

      <View style={styles.logoView}>
        <Image source={colorScheme === 'light' ? instadark : instalight} />
      </View>

      <View style={styles.formView}>
        <Formik
          initialValues={{
            email: 'vai@gmail.com',
            password: 'Vai@123456',
          }}
          onSubmit={values => {
            console.log(values);
            userSignIn(values);
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
              <InputText
                value={values.email}
                onBlur={handleBlur('email')}
                onChange={handleChange('email')}
                PlaceHolder={t(LanguageConstant.email)}
              />
              {errors.email && touched.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
              <InputText
                value={values.password}
                onBlur={handleBlur('password')}
                onChange={handleChange('password')}
                PlaceHolder={t(LanguageConstant.password)}
              />
              {errors.password && touched.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
              <TouchableOpacity
                style={styles.forgetbuttonstyle}
                onPress={() => setModalVisible(true)}
              >
                <Text
                  style={[
                    styles.forgettextstyle,
                    { color: colors.primaryblue },
                  ]}
                >
                  {t(LanguageConstant.forgetPassword)}
                </Text>
              </TouchableOpacity>
              <ButtonComponent
                title={t(LanguageConstant.login)}
                onclick={handleSubmit}
              />
            </>
          )}
        </Formik>

        <View style={styles.signupview}>
          <Text
            style={
              colorScheme === 'dark'
                ? { color: colors.text }
                : { color: colors.text }
            }
          >
            {t(LanguageConstant.doNotHaveAccount)}
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('SignupScreen');
            }}
          >
            <Text style={[styles.signupstyle, { color: colors.primaryblue }]}>
              {t(LanguageConstant.signup)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.googleView}>
        <View style={[styles.dashstyle, { borderColor: colors.dashcolor }]} />
        <Text style={[styles.orstyle, { color: colors.text }]}>{'OR'}</Text>
        <View style={[styles.dashstyle, { borderColor: colors.dashcolor }]} />
      </View>

      <View style={styles.socialView}>
        <View style={styles.sociallogoView}>
          <TouchableOpacity onPress={() => googleSignIn()}>
            <Image style={styles.sociallogo} source={googlelogo} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Image style={styles.sociallogo} source={microsoftlogo} />
          </TouchableOpacity>
        </View>
        <View style={styles.textviewstyle}>
          <Text style={[styles.textStylefrom, { color: colors.fromcolor }]}>
            {t(LanguageConstant.from)}
          </Text>
          <Text style={[styles.textStylefacebook, { color: colors.text }]}>
            {t(LanguageConstant.facebook)}
          </Text>
        </View>
      </View>
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Formik
              initialValues={{
                email: '',
              }}
              onSubmit={values => {
                resetPassword(values.email);
              }}
              validationSchema={validationSchema}
            >
              {({
                values,
                errors,
                touched,
                handleBlur,
                handleSubmit,
                handleChange,
              }) => (
                <>
                  <InputText
                    PlaceHolder={t(LanguageConstant.email)}
                    value={values.email}
                    onChange={handleChange('email')}
                    onBlur={handleBlur('email')}
                  />
                  {errors.email && touched.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}

                  <TouchableOpacity
                    style={[
                      styles.button,
                      { backgroundColor: colors.primaryblue },
                    ]}
                    onPress={() => handleSubmit()}
                  >
                    <Text style={[styles.textStyle, { color: colors.text }]}>
                      {'submit'}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </Formik>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  textStylefrom: { fontSize: 14, fontWeight: '600' },
  textStylefacebook: { fontSize: 16, fontWeight: '400' },
  textviewstyle: { margin: 20, alignItems: 'center' },
  sociallogoView: {
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialView: {
    flex: 2,
    justifyContent: 'space-between',
  },
  sociallogo: { height: 30, width: 30, marginHorizontal: 10 },
  orstyle: { flex: 0.6, textAlign: 'center' },

  dashstyle: {
    flex: 1,
    height: 0,
    marginTop: 10,
    borderWidth: 0.8,
  },
  signupview: { flexDirection: 'row', justifyContent: 'center' },
  signupstyle: { fontWeight: '700' },
  forgettextstyle: {
    fontSize: 13,
    fontWeight: '700',
    marginVertical: 10,
  },
  forgetbuttonstyle: { alignSelf: 'flex-end' },
  dropdownstyle: { borderWidth: 0 },
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
  },
  dropdowncontainer: {
    flex: 1,
    width: '25%',
    borderWidth: 0,
    alignSelf: 'center',
  },
  dropdownView: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    paddingHorizontal: 15,
  },

  container: {
    flex: 1,
  },
  text: {
    fontSize: 20,
    fontWeight: '500',
  },
  errorText: {
    color: 'red',
    fontSize: 15,
    fontWeight: '800',
  },

  centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalView: {
    padding: 30,
    elevation: 5,
    width: '90%',
    shadowRadius: 4,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    backgroundColor: 'white',
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
  },
  textStyle: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
