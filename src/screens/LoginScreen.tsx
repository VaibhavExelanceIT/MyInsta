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
} from 'react-native';

import * as Yup from 'yup';
import { Formik } from 'formik';
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
import DropDownPicker from 'react-native-dropdown-picker';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';

import { darkTheme } from '../theme/darkTheme';
import { lightTheme } from '../theme/lightTheme';
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

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .email("well that's not an email"),
  password: Yup.string()
    .label('Password')
    .required('Password is required')
    .matches(/\d/, 'Password must have a number')
    .matches(/\w*[a-z]\w*/, 'Password must have a small letter')
    .matches(/\w*[A-Z]\w*/, 'Password must have a capital letter')
    .min(8, ({ min }) => `Password must be at least ${min} characters`),
});
interface usertype {
  email: string;
  password: string;
}

const LoginScreen = () => {
  const navigation = useNavigation<any>();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '956857887247-jttn9l0vhgdgabp27o8634sg2uvmc0d0.apps.googleusercontent.com',
      iosClientId:
        '956857887247-fv38un1ht58puru0atl6vio70dabj7t6.apps.googleusercontent.com',
    });
  }, []);

  const { t } = useTranslation();

  const [modalVisible, setModalVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<any>();
  const [items, setItems] = useState([
    { label: t(LanguageConstant.english), value: 'en' },
    { label: t(LanguageConstant.hindi), value: 'hi' },
    { label: t(LanguageConstant.urdu), value: 'ar' },
  ]);

  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  colorScheme === 'dark'
    ? DropDownPicker.setTheme('DARK')
    : DropDownPicker.setTheme('LIGHT');

  const changeLanguage = () => {
    i18n
      .changeLanguage(value)
      .then(() => {
        RNRestart.Restart();
        I18nManager.forceRTL(i18n.language === 'ar');
      })
      .catch(() => {});
  };

  const googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const signInResult = await GoogleSignin.signIn();

      let idToken: any = signInResult.data?.idToken;

      if (!idToken) {
        throw new Error('No ID token found');
      }
      const googleCredential = GoogleAuthProvider.credential(
        signInResult?.data?.idToken,
      );

      const useremail = signInResult?.data?.user?.email;

      const isUserPresent = await firestore()
        .collection('UsersData')
        .where('email', '==', useremail)
        .get();

      if (!isUserPresent.empty) {
        navigation.navigate('DrawerNavigation', { email: useremail });
      } else {
        navigation.navigate('UserDetailsScreeen', { email: useremail });
      }

      return signInWithCredential(getAuth(), googleCredential);
    } catch (error) {}
  };

  const userSignIn = (values: usertype) => {
    signInWithEmailAndPassword(getAuth(), values.email, values.password)
      .then(() => {
        showMessage({
          message: 'success',
          description: 'Your are logged in',
          type: 'success',
        });

        navigation.navigate('DrawerNavigation', { email: values.email });
      })
      .catch(() => {
        showMessage({
          message: 'Error!!',
          description: 'Email or Password has be wrong',
          type: 'danger',
        });
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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
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
          containerStyle={styles.dropdowncontainer}
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
                <Text style={styles.forgettextstyle}>
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
          <Text style={colorScheme === 'dark' ? styles.darkViewText : {}}>
            {t(LanguageConstant.doNotHaveAccount)}
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('SignupScreen');
            }}
          >
            <Text style={styles.signupstyle}>{t(LanguageConstant.signup)}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.googleView}>
        <View style={styles.dashstyle} />
        <Text
          style={
            colorScheme === 'light'
              ? styles.orstyle
              : [styles.orstyle, { color: '#FFFFFF' }]
          }
        >
          {'OR'}
        </Text>
        <View style={styles.dashstyle} />
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
          <Text style={styles.textStylefrom}>{t(LanguageConstant.from)}</Text>
          <Text
            style={
              colorScheme === 'light'
                ? styles.textStylefacebook
                : styles.darkThemeFaceBookStyle
            }
          >
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
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => handleSubmit()}
                  >
                    <Text style={styles.textStyle}>{'submit'}</Text>
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
  darkThemeFaceBookStyle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '400',
  },
  darkViewText: { color: '#FFFFFF' },
  textStylefrom: { fontSize: 14, fontWeight: '600', color: '#AEA9A9' },
  textStylefacebook: { fontSize: 16, fontWeight: '400', color: '#070000' },
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
    borderColor: '#CCCCCC',
  },
  signupview: { flexDirection: 'row', justifyContent: 'center' },
  signupstyle: { color: '#1877F2', fontWeight: '700' },
  forgettextstyle: {
    fontSize: 13,
    color: '#1877F2',
    fontWeight: '700',
    marginVertical: 10,
  },
  forgetbuttonstyle: { alignSelf: 'flex-end' },
  dropdownstyle: { borderWidth: 0 },
  googleView: {
    // flex: 5,
    alignSelf: 'center',
    flexDirection: 'row',
    paddingHorizontal: 50,
  },
  formView: {
    flex: 2,
    paddingHorizontal: 50,
    // justifyContent: 'space-evenly',÷
  },
  logoView: {
    // flex: 1,
    alignSelf: 'center',
  },
  dropdowncontainer: {
    flex: 1,
    width: '25%',
    borderWidth: 0,
    color: '#C5C5C5',
    alignSelf: 'center',
  },
  dropdownView: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  btnstyle: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 20,
    backgroundColor: '#AEa',
  },
  container: {
    flex: 1,
    // justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: '500',
  },
  errorText: {
    // marginTop: 10,
    color: 'red',
    fontSize: 15,
    fontWeight: '800',
    // marginBottom: 10,
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
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
