import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  I18nManager,
} from 'react-native';

import * as Yup from 'yup';

import { useFormik } from 'formik';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  createUserWithEmailAndPassword,
} from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { fs } from '../helper/fontSize';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from 'react-i18next';
import InputText from '../components/InputText';
import { ColorProps } from '../constants/color';
import { useFCMToken } from '../hooks/useFCMToken';
import { getText } from '../constants/language/i18next';
import { useThemeColors } from '../hooks/useThemeColors';
import LoaderComponent from '../components/LoaderComponent';
import ButtonComponent from '../components/ButtonComponent';
import { BackArrowDark, BackArrowLight } from '../helper/icon';
import { instadark, instalight, googlelogo } from '../helper/images';
import RadioButtonComponent from '../components/RadioButtonComponent';

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

const getSchemas = () => {
  const firstName = Yup.string().required(getText('firstNameRequiredError'));
  const lastName = Yup.string().required(getText('lastNameRequiredError'));
  const gender = Yup.string().required(getText('genderRequiredError'));
  const mobileNo = Yup.string()
    .required(getText('mobileNoRequiredError'))
    .matches(/^[0-9]+$/, getText('mobileNoDigitOnly'))
    .max(10)
    .min(10);
  const DOB = Yup.string().required(getText('dobRequired'));
  const email = Yup.string()
    .required(getText('email_required'))
    .email(getText('email_error'));
  const password = Yup.string()
    .label(getText('password'))
    .required(getText('password_required'))
    .matches(/\d/, getText('password_must_number'))
    .matches(/[a-z]/, getText('password_must_small'))
    .matches(/[A-Z]/, getText('password_must_capital'));

  const confirmPassword = Yup.string()
    .required(getText('confirmPasswordRequired'))
    .oneOf([Yup.ref('password')], getText('confirmPasswordMatch'));

  return {
    registerValidationSchema: Yup.object({
      DOB,
      email,
      gender,
      password,
      lastName,
      mobileNo,
      firstName,
      confirmPassword,
    }),
  };
};

const SignupScreen = () => {
  const [isDatePickerVisible, setIsDatePickerVisibility] = useState(false);
  const [schemas, setSchemas] = useState(getSchemas());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const currentDate = new Date();
  const navigation = useNavigation<any>();
  const { isDarkMode } = useTheme();

  const colors = useThemeColors();
  const styles = signupScreenStyle(colors);
  const token = useFCMToken();

  const { i18n } = useTranslation();
  useEffect(() => {
    const handleLanguageChange = () => {
      const newSchemas = getSchemas();
      setSchemas(newSchemas);

      formik.resetForm({ values: formik.values });
    };

    i18n.on('languageChanged', handleLanguageChange);
    return () => i18n.off('languageChanged', handleLanguageChange);
  }, []);

  const formik = useFormik({
    initialValues: {
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
    },
    onSubmit: values => {
      setIsLoading(true);
      setIsModalVisible(true);
      writeFirestore(values);
    },
    validationSchema: schemas.registerValidationSchema,
  });

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
        message: getText('error'),
        description: `${getText('error_message')} ${error}`,
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
              token: token,
            })
            .then(() => {
              showMessage({
                message: getText('success'),
                description: `${getText('logged_in_message')}`,
                type: 'success',
              });
              navigation.navigate('DrawerNavigation', { email: values.email });
            })
            .catch(error => {
              showMessage({
                message: getText(error),
                description: `${getText('dataErrorMessage')}  ${error}`,
                type: 'danger',
              });
            });
        } else {
          showMessage({
            message: getText('error'),
            description: `${getText('dataErrorMessage')}`,
            type: 'danger',
          });
        }
      } else {
        showMessage({
          message: getText('error'),
          description: `${getText('dataErrorMessage')}`,
          type: 'danger',
        });
      }

      setIsModalVisible(false);
      setIsLoading(false);
    } catch (error) {
      setIsModalVisible(false);
      setIsLoading(false);
      showMessage({
        message: getText('error'),
        description: `${getText('dataErrorMessage')}  ${error}`,
        type: 'danger',
      });
    }
  };

  const goBack = () => {
    navigation.goBack();
  };
  const isRTL = I18nManager.isRTL;
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View>
        <TouchableOpacity onPress={goBack}>
          {isDarkMode ? (
            <BackArrowLight
              height={20}
              width={20}
              style={isRTL && styles.backRTLStyle}
            />
          ) : (
            <BackArrowDark
              height={20}
              width={20}
              style={isRTL && styles.backRTLStyle}
            />
          )}
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.logoView}>
          <Image source={isDarkMode ? instalight : instadark} />
        </View>
        <Text style={styles.textDarkStyle}>{getText('signupForm')}</Text>

        <>
          <InputText
            value={formik.values.firstName}
            onBlur={formik.handleBlur('firstName')}
            onChange={formik.handleChange('firstName')}
            placeholder={getText('firstname')}
          />
          {formik.errors.firstName && formik.touched.firstName && (
            <Text style={styles.errorText}>{formik.errors.firstName}</Text>
          )}

          <InputText
            value={formik.values.lastName}
            onBlur={formik.handleBlur('lastName')}
            onChange={formik.handleChange('lastName')}
            placeholder={getText('lastname')}
          />
          {formik.errors.lastName && formik.touched.lastName && (
            <Text style={styles.errorText}>{formik.errors.lastName}</Text>
          )}

          <RadioButtonComponent
            value={formik.values.gender}
            onChange={formik.handleChange('gender')}
          />
          {formik.errors.gender && formik.touched.gender && (
            <Text style={styles.errorText}>{formik.errors.gender}</Text>
          )}
          <InputText
            value={formik.values.mobileNo}
            onBlur={formik.handleBlur('mobileNo')}
            onChange={formik.handleChange('mobileNo')}
            placeholder={getText('mobile_no')}
            isMobileNo={true}
          />
          {formik.errors.mobileNo && formik.touched.mobileNo && (
            <Text style={styles.errorText}>{formik.errors.mobileNo}</Text>
          )}

          <TouchableOpacity onPress={showDatePicker}>
            <InputText
              isEditable={false}
              onBlur={formik.handleBlur('DOB')}
              value={formik.values.DOB.toString()}
              onChange={formik.handleChange('DOB')}
              placeholder={getText('DOB')}
            />
          </TouchableOpacity>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            maximumDate={currentDate}
            mode="date"
            onConfirm={date => {
              hideDatePicker();

              formik.handleChange(
                formik.setFieldValue('DOB', date.toDateString()),
              );
            }}
            onCancel={hideDatePicker}
          />

          {formik.errors.DOB && formik.touched.DOB && (
            <Text style={styles.errorText}>{formik.errors.DOB}</Text>
          )}

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

          <InputText
            value={formik.values.confirmPassword}
            onBlur={formik.handleBlur('confirmPassword')}
            onChange={formik.handleChange('confirmPassword')}
            placeholder={getText('confirm_password')}
            isPassword={true}
          />
          {formik.errors.confirmPassword && formik.touched.confirmPassword && (
            <Text style={styles.errorText}>
              {formik.errors.confirmPassword}
            </Text>
          )}

          <ButtonComponent
            btnStyle={styles.btnStyle}
            textStyle={styles.textStyle}
            onClick={formik.handleSubmit}
            title={getText('signup')}
          />
        </>

        {isLoading && (
          <LoaderComponent
            isLoading={isLoading}
            isModalVisible={isModalVisible}
          />
        )}

        <View style={styles.googleView}>
          <View style={styles.dashStyle} />
          <Text style={styles.orStyle}>{getText('or')}</Text>
          <View style={styles.dashStyle} />
        </View>
        <View style={styles.socialView}>
          <View style={styles.socialLogoView}>
            <TouchableOpacity onPress={googleSignIn}>
              <Image style={styles.socialLogo} source={googlelogo} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <View style={styles.textViewStyle}>
        <Text style={styles.textStyleFrom}>{getText('from')}</Text>
        <Text style={styles.textStyleFacebook}>{getText('facebook')}</Text>
      </View>
    </SafeAreaView>
  );
};

export default SignupScreen;

const signupScreenStyle = (colors: ColorProps) =>
  StyleSheet.create({
    backRTLStyle: { transform: [{ rotate: '180deg' }] },
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
      color: colors.declineBtnStyle,
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
    textViewStyle: { alignItems: 'center' },
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
      fontSize: fs(15),
    },
  });
