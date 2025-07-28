import React, { useState } from 'react';
import {
  Text,
  View,
  Alert,
  Image,
  StyleSheet,
  ScrollView,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';

import * as Yup from 'yup';
import { t } from 'i18next';
import { Formik } from 'formik';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';
import { RadioButton, useTheme } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from '@react-native-firebase/auth';

import { darkTheme } from '../theme/darkTheme';
import InputText from '../components/InputText';
import { lightTheme } from '../theme/lightTheme';
import ButtonComponent from '../components/ButtonComponent';
import { LanguageConstant } from '../constants/language_constants';
import {
  instadark,
  instalight,
  googlelogo,
  microsoftlogo,
} from '../helper/images';

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First Name is Required'),
  lastName: Yup.string().required('Last Name is Required'),
  gender: Yup.string().required('Gender is Required'),
  mobileNo: Yup.string().required('Mobile No is Required').max(10).min(10),
  DOB: Yup.string().required('dob is Required'),
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

  confirmPassword: Yup.string()
    .required('Confirm Password is required')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
});

interface userData {
  DOB: string;
  email: string;
  gender: string;
  password: string;
  lastName: string;
  mobileNo: string;
  firstName: string;
  userImage?: string;
  confirmPassword: string;
}

const SignupScreen = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const theme1 = useTheme();
  const navigation = useNavigation<any>();
  const googleSignIn = async () => {
    console.log('inside the signin');
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

      Alert.alert('You are Loggedin');
      navigation.navigate('UserDetailsScreeen', { email: useremail });
      return signInWithCredential(getAuth(), googleCredential);
    } catch (error) {
      console.log(error);
    }
  };
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const usersCollection = firestore().collection('UsersData');

  const writefirestore = async (values: userData) => {
    try {
      await usersCollection
        .add({
          DOB: values.DOB,
          userImage:
            'https://www.pexels.com/photo/blue-bmw-sedan-near-green-lawn-grass-170811/',
          email: values.email,
          gender: values.gender,
          mobileNo: values.mobileNo,
          password: values.password,
          lastName: values.lastName,
          firstName: values.firstName,
        })
        .then(() => {
          console.log(values);
          showMessage({
            type: 'success',
            message: 'success',
            description: 'User Registrated',
          });
        });
    } catch (error) {
      showMessage({
        type: 'danger',
        message: 'Error',
        description: 'There is some error in the data',
      });
      console.log(error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.logoView}>
          <Image source={colorScheme === 'light' ? instadark : instalight} />
        </View>
        <Text
          style={
            colorScheme === 'dark'
              ? styles.textDarkStyle
              : styles.textlightStyle
          }
        >
          {'SignUp Form'}
        </Text>
        <Formik
          initialValues={{
            DOB: '',
            email: '',
            gender: '',
            lastName: '',
            password: '',
            mobileNo: '',
            firstName: '',
            confirmPassword: '',
          }}
          onSubmit={values => {
            console.log(values);
            writefirestore(values);
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
            setFieldValue,
          }) => (
            <>
              <InputText
                value={values.firstName}
                onBlur={handleBlur('firstName')}
                onChange={handleChange('firstName')}
                PlaceHolder={t(LanguageConstant.firstname)}
              />
              {errors.firstName && touched.firstName && (
                <Text style={styles.errorText}>{errors.firstName}</Text>
              )}

              <InputText
                value={values.lastName}
                onBlur={handleBlur('lastName')}
                onChange={handleChange('lastName')}
                PlaceHolder={t(LanguageConstant.lastname)}
              />
              {errors.lastName && touched.lastName && (
                <Text style={styles.errorText}>{errors.lastName}</Text>
              )}

              <View>
                <Text
                  style={colorScheme === 'dark' ? styles.genderTextStyle : {}}
                >
                  {'Gender'}
                </Text>
                <RadioButton.Group
                  value={values.gender}
                  onValueChange={handleChange('gender')}
                >
                  <View style={styles.radiobtnView}>
                    <RadioButton value="Male" theme={theme1} />
                    <Text
                      style={colorScheme === 'dark' ? styles.textStyle : {}}
                    >
                      {'Male'}
                    </Text>
                  </View>
                  <View style={styles.radiobtnView}>
                    <RadioButton value="Female" theme={theme1} />
                    <Text
                      style={colorScheme === 'dark' ? styles.textStyle : {}}
                    >
                      {'Female'}
                    </Text>
                  </View>
                  <View style={styles.radiobtnView}>
                    <RadioButton value="Other" theme={theme1} />
                    <Text
                      style={colorScheme === 'dark' ? styles.textStyle : {}}
                    >
                      {'Other'}
                    </Text>
                  </View>
                </RadioButton.Group>
              </View>
              {errors.gender && touched.gender && (
                <Text style={styles.errorText}>{errors.gender}</Text>
              )}
              <InputText
                value={values.mobileNo}
                onBlur={handleBlur('mobileNo')}
                onChange={handleChange('mobileNo')}
                PlaceHolder={t(LanguageConstant.mobile_no)}
              />
              {errors.mobileNo && touched.mobileNo && (
                <Text style={styles.errorText}>{errors.mobileNo}</Text>
              )}

              <TouchableOpacity onPress={showDatePicker}>
                <InputText
                  isEditable={false}
                  onBlur={handleBlur('DOB')}
                  value={values.DOB.toString()}
                  onChange={handleChange('DOB')}
                  PlaceHolder={t(LanguageConstant.DOB)}
                />
              </TouchableOpacity>

              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={date => {
                  hideDatePicker();
                  console.log(date.toDateString());
                  handleChange(setFieldValue('DOB', date.toDateString()));
                }}
                onCancel={hideDatePicker}
              />

              {errors.DOB && touched.DOB && (
                <Text style={styles.errorText}>{errors.DOB}</Text>
              )}

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

              <InputText
                value={values.confirmPassword}
                onBlur={handleBlur('confirmPassword')}
                onChange={handleChange('confirmPassword')}
                PlaceHolder={t(LanguageConstant.confirm_password)}
              />
              {errors.confirmPassword && touched.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}

              <ButtonComponent
                onclick={handleSubmit}
                title={t(LanguageConstant.login)}
              />
            </>
          )}
        </Formik>
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
      </ScrollView>
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  textDarkStyle: {
    fontSize: 30,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
    textDecorationColor: '#FFFFFF',
    textDecorationLine: 'underline',
  },
  textlightStyle: {
    fontSize: 30,
    fontWeight: '600',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  container: {
    flex: 1,
    padding: 20,
    height: '80%',
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 15,
    fontWeight: '800',
  },
  logoView: {
    marginBottom: 10,
    alignSelf: 'center',
  },
  orstyle: { flex: 0.6, textAlign: 'center' },

  dashstyle: {
    flex: 1,
    height: 0,
    marginTop: 10,
    borderWidth: 0.8,
    borderColor: '#CCCCCC',
  },
  googleView: {
    alignSelf: 'center',
    flexDirection: 'row',
    paddingHorizontal: 50,
  },
  socialView: {
    flex: 2,
    justifyContent: 'space-between',
  },
  sociallogoView: {
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  sociallogo: { height: 30, width: 30, marginHorizontal: 10 },
  textviewstyle: { margin: 20, alignItems: 'center' },
  textStylefrom: { fontSize: 14, fontWeight: '600', color: '#AEA9A9' },
  textStylefacebook: { fontSize: 16, fontWeight: '400', color: '#070000' },
  darkThemeFaceBookStyle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '400',
  },
  genderTextStyle: {
    color: '#FFFFFF',
  },
  radiobtnView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textStyle: {
    color: '#FFFFFF',
  },
});
