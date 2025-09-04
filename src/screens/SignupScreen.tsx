import React, { useState } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  ScrollView,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';

import * as Yup from 'yup';
import { t } from 'i18next';
import { Formik } from 'formik';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  createUserWithEmailAndPassword,
} from '@react-native-firebase/auth';

import InputText from '../components/InputText';
import ButtonComponent from '../components/ButtonComponent';
import { LanguageConstant } from '../constants/language_constants';
import { instadark, instalight, googlelogo } from '../helper/images';
import RadioButtonComponent from '../components/RadioButtonComponent';
import { useThemeColors } from '../hooks/useThemeColors';
import { ColorProps } from '../constants/color';
import { fs } from '../helper/fontSize';

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required(t(LanguageConstant.firstNameRequiredError)),
  lastName: Yup.string().required(t(LanguageConstant.lastNameRequiredError)),
  gender: Yup.string().required(t(LanguageConstant.genderRequiredError)),
  mobileNo: Yup.string()
    .required(t(LanguageConstant.mobileNoRequiredError))
    .max(10)
    .min(10),
  DOB: Yup.string().required(t(LanguageConstant.dobRequired)),
  email: Yup.string()
    .required(t(LanguageConstant.email_required))
    .email(t(LanguageConstant.email_error)),
  password: Yup.string()
    .label(t(LanguageConstant.password))
    .required(t(LanguageConstant.password_required))
    .matches(/\d/, t(LanguageConstant.password_must_number))
    .matches(/\w*[a-z]\w*/, t(LanguageConstant.password_must_small))
    .matches(/\w*[A-Z]\w*/, t(LanguageConstant.password_must_capital)),

  confirmPassword: Yup.string()
    .required(t(LanguageConstant.confirmPasswordRequired))
    .oneOf([Yup.ref('password')], t(LanguageConstant.confirmPasswordMatch)),
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
  follower: Array<string>;
  confirmPassword: string;
  following: Array<string>;
  requestSent: Array<string>;
  requestCome: Array<string>;
}

const SignupScreen = () => {
  const [isDatePickerVisible, setIsDatePickerVisibility] = useState(false);

  const navigation = useNavigation<any>();
  const colorScheme = useColorScheme();
  const colors = useThemeColors();
  const styles = signupScreenStyle(colors);

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

      return signInWithCredential(getAuth(), googleCredential);
    } catch (error) {
      showMessage({
        message: t(LanguageConstant.error),
        description: `${t(LanguageConstant.error_message)} ${error}`,
        type: 'danger',
      });
    }
  };

  const showDatePicker = () => {
    setIsDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setIsDatePickerVisibility(false);
  };

  const writeFirestore = async (values: userData) => {
    const isUserPresent = await firestore()
      .collection('UsersData')
      .where('email', '==', values.email)
      .get();
    try {
      if (isUserPresent.empty) {
        await createUserWithEmailAndPassword(
          getAuth(),
          values.email,
          values.password,
        );

        const currentUser = auth().currentUser;
        const userId = currentUser ? currentUser.uid : null;

        if (userId !== null) {
          const usersCollection = firestore()
            .collection('UsersData')
            .doc(userId);

          usersCollection
            .set({
              DOB: values.DOB,
              userImage:
                'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?_gl=1*k2m0me*_ga*MTk3NDc0NTgxMi4xNzQ3OTk4NTM2*_ga_8JE65Q40S6*czE3NTQzMDExMjMkbzMkZzEkdDE3NTQzMDE4MzgkajYwJGwwJGgw',
              email: values.email,
              gender: values.gender,
              mobileNo: values.mobileNo,
              lastName: values.lastName,
              firstName: values.firstName,
              follower: [],
              following: [],
              requestSent: [],
              requestCome: [],
            })
            .then(() => {
              showMessage({
                message: t(LanguageConstant.success),
                description: `${t(LanguageConstant.logged_in_message)}`,
                type: 'success',
              });
              navigation.navigate('DrawerNavigation', { email: values.email });
            })
            .catch(error => {
              showMessage({
                message: t(LanguageConstant.error),
                description: `${t(
                  LanguageConstant.dataErrorMessage,
                )}  ${error}`,
                type: 'danger',
              });
            });
        } else {
          showMessage({
            message: t(LanguageConstant.error),
            description: `${t(LanguageConstant.dataErrorMessage)}`,
            type: 'danger',
          });
        }
      } else {
        showMessage({
          message: t(LanguageConstant.error),
          description: `${t(LanguageConstant.dataErrorMessage)}`,
          type: 'danger',
        });
      }
    } catch (error) {
      showMessage({
        message: t(LanguageConstant.error),
        description: `${t(LanguageConstant.dataErrorMessage)}  ${error}`,
        type: 'danger',
      });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.logoView}>
          <Image source={colorScheme === 'light' ? instadark : instalight} />
        </View>
        <Text style={styles.textDarkStyle}>
          {t(LanguageConstant.signupForm)}
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
            follower: [],
            following: [],
            requestSent: [],
            requestCome: [],
            confirmPassword: '',
          }}
          onSubmit={values => {
            writeFirestore(values);
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
                placeholder={t(LanguageConstant.firstname)}
              />
              {errors.firstName && touched.firstName && (
                <Text style={styles.errorText}>{errors.firstName}</Text>
              )}

              <InputText
                value={values.lastName}
                onBlur={handleBlur('lastName')}
                onChange={handleChange('lastName')}
                placeholder={t(LanguageConstant.lastname)}
              />
              {errors.lastName && touched.lastName && (
                <Text style={styles.errorText}>{errors.lastName}</Text>
              )}

              <RadioButtonComponent
                value={values.gender}
                onChange={handleChange('gender')}
              />
              {errors.gender && touched.gender && (
                <Text style={styles.errorText}>{errors.gender}</Text>
              )}
              <InputText
                value={values.mobileNo}
                onBlur={handleBlur('mobileNo')}
                onChange={handleChange('mobileNo')}
                placeholder={t(LanguageConstant.mobile_no)}
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
                  placeholder={t(LanguageConstant.DOB)}
                />
              </TouchableOpacity>

              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={date => {
                  hideDatePicker();

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
                placeholder={t(LanguageConstant.email)}
              />
              {errors.email && touched.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
              <InputText
                value={values.password}
                onBlur={handleBlur('password')}
                onChange={handleChange('password')}
                placeholder={t(LanguageConstant.password)}
              />
              {errors.password && touched.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}

              <InputText
                value={values.confirmPassword}
                onBlur={handleBlur('confirmPassword')}
                onChange={handleChange('confirmPassword')}
                placeholder={t(LanguageConstant.confirm_password)}
              />
              {errors.confirmPassword && touched.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}

              <ButtonComponent
                btnStyle={styles.btnStyle}
                textStyle={styles.textStyle}
                onClick={handleSubmit}
                title={t(LanguageConstant.signup)}
              />
            </>
          )}
        </Formik>
        <View style={styles.googleView}>
          <View style={styles.dashStyle} />
          <Text style={styles.orStyle}>{t(LanguageConstant.or)}</Text>
          <View style={styles.dashStyle} />
        </View>
        <View style={styles.socialView}>
          <View style={styles.socialLogoView}>
            <TouchableOpacity onPress={googleSignIn}>
              <Image style={styles.socialLogo} source={googlelogo} />
            </TouchableOpacity>
          </View>
          <View style={styles.textViewStyle}>
            <Text style={styles.textStyleFrom}>{t(LanguageConstant.from)}</Text>
            <Text style={styles.textStyleFacebook}>
              {t(LanguageConstant.facebook)}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SignupScreen;

const signupScreenStyle = (colors: ColorProps) =>
  StyleSheet.create({
    btnStyle: {
      padding: 10,
      borderRadius: 6,
      marginVertical: 10,
      backgroundColor: colors.primaryblue,
    },

    textDarkStyle: {
      fontSize: fs(26),
      fontWeight: '600',
      textAlign: 'center',
      color: colors.text,
      textDecorationLine: 'underline',
      textDecorationColor: colors.text,
    },

    container: {
      flex: 1,
      padding: 20,
      height: '80%',
      justifyContent: 'center',
      backgroundColor: colors.background,
    },
    errorText: {
      color: 'red',
      fontSize: fs(15),
      fontWeight: '800',
    },
    logoView: {
      marginBottom: 10,
      alignSelf: 'center',
    },
    orStyle: { flex: 0.6, textAlign: 'center', color: colors.text },

    dashStyle: {
      flex: 1,
      height: 0,
      marginTop: 10,
      borderWidth: 0.8,
      borderColor: colors.dashcolor,
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
    socialLogoView: {
      margin: 20,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    socialLogo: { height: 30, width: 30, marginHorizontal: 10 },
    textViewStyle: { margin: 20, alignItems: 'center' },
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

    textStyle: {
      color: colors.white,
      fontWeight: 'bold',
    },
  });
