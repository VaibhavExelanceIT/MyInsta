import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  I18nManager,
  TouchableOpacity,
} from 'react-native';

import * as Yup from 'yup';

import { useFormik } from 'formik';
import auth from '@react-native-firebase/auth';
import { useTranslation } from 'react-i18next';
import firestore from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import { fs } from '../helper/fontSize';
import { useTheme } from '../hooks/useTheme';
import { ColorProps } from '../constants/color';
import InputText from '../components/InputText';
import { useFCMToken } from '../hooks/useFCMToken';
import { getText } from '../constants/language/i18next';
import { useThemeColors } from '../hooks/useThemeColors';
import { instadark, instalight } from '../helper/images';
import ButtonComponent from '../components/ButtonComponent';
import LoaderComponent from '../components/LoaderComponent';
import { BackArrowDark, BackArrowLight } from '../helper/icon';
import RadioButtonComponent from '../components/RadioButtonComponent';

const getSchemas = () => {
  const firstName = Yup.string().required(getText('firstNameRequiredError'));
  const lastName = Yup.string().required(getText('lastNameRequiredError'));
  const gender = Yup.string().required(getText('genderRequiredError'));
  const mobileNo = Yup.string()
    .required(getText('mobileNoRequiredError'))
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
    .matches(/\w*[a-z]\w*/, getText('password_must_small'))
    .matches(/\w*[A-Z]\w*/, getText('password_must_capital'));

  const confirmPassword = Yup.string()
    .required(getText('confirmPasswordRequired'))
    .oneOf([Yup.ref('password')], getText('confirmPasswordMatch'));

  return {
    userDeatilsValidationSchema: Yup.object({
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
  follower: Array<string>;
  following: Array<string>;
  requestSent: Array<string>;
  requestCome: Array<string>;
}
const UserDetailsScreeen = ({ route }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [schemas, setSchemas] = useState(getSchemas());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisibility] = useState(false);

  const currentDate = new Date();
  const colors = useThemeColors();
  const { isDarkMode } = useTheme();
  const navigation = useNavigation<any>();
  const styles = userDetailsScreeenStyle(colors);

  const { i18n } = useTranslation();
  const token = useFCMToken();
  const email: string = route.params.email;

  const showDatePicker = () => {
    setIsDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setIsDatePickerVisibility(false);
  };

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
      userImage:
        'https://www.pexels.com/photo/blue-bmw-sedan-near-green-lawn-grass-170811/',
      DOB: '',
      gender: '',
      email: email,
      lastName: '',
      password: '',
      mobileNo: '',
      firstName: '',
      confirmPassword: '',
      following: [],
      follower: [],
      requestSent: [],
      requestCome: [],
    },
    validationSchema: schemas.userDeatilsValidationSchema,
    onSubmit: values => {
      setIsLoading(true);
      setIsModalVisible(true);
      writeFirestore(values);
    },
  });

  const writeFirestore = async (values: userData) => {
    const isUserPresent = await firestore()
      .collection('UsersData')
      .where('email', '==', values.email)
      .get();

    try {
      if (isUserPresent.empty) {
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
              navigation.reset({
                index: 0,
                routes: [
                  { name: 'DrawerNavigation', params: { email: values.email } },
                ],
              });
            })
            .catch(() => {
              showMessage({
                message: getText('error'),
                description: `${getText('dataErrorMessage')} `,
                type: 'danger',
              });
            });
        } else {
          showMessage({
            message: getText('error'),
            description: `${getText('error_message')} `,
            type: 'danger',
          });
        }
      } else {
        showMessage({
          type: 'warning',
          message: getText('success'),
          description: getText('userAlreadyRegistered'),
        });
        navigation.navigate('loginScreen');
      }
    } catch (error) {
      showMessage({
        message: getText('error'),
        description: `${getText('error_message')} `,
        type: 'danger',
      });
    } finally {
      setIsModalVisible(false);
      setIsLoading(false);
    }
  };
  const goBack = () => {
    navigation.goBack();
  };
  const isRTL = I18nManager.isRTL;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.backButtonStyle}>
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

        <Text style={styles.textDarkStyle}>{getText('userDetails')}</Text>

        <>
          <InputText
            placeholder={getText('firstname')}
            value={formik.values.firstName}
            onChange={formik.handleChange('firstName')}
            onBlur={formik.handleBlur('firstName')}
          />
          {formik.errors.firstName && formik.touched.firstName && (
            <Text style={styles.errorText}>{formik.errors.firstName}</Text>
          )}

          <InputText
            placeholder={getText('lastname')}
            value={formik.values.lastName}
            onChange={formik.handleChange('lastName')}
            onBlur={formik.handleBlur('lastName')}
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
            mode="date"
            maximumDate={currentDate}
            onConfirm={date => {
              formik.handleChange(
                formik.setFieldValue('DOB', date.toDateString()),
              );
              hideDatePicker();
            }}
            onCancel={hideDatePicker}
          />

          {formik.errors.DOB && formik.touched.DOB && (
            <Text style={styles.errorText}>{formik.errors.DOB}</Text>
          )}

          <InputText
            isEditable={false}
            value={formik.values.email}
            onBlur={formik.handleBlur('email')}
            onChange={formik.handleChange('email')}
            placeholder={getText(email)}
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
            title={getText('submit')}
            onClick={formik.handleSubmit}
            btnStyle={styles.btnStyle}
            textStyle={styles.textStyle}
          />
        </>

        {isLoading && (
          <LoaderComponent
            isLoading={isLoading}
            isModalVisible={isModalVisible}
          />
        )}
      </ScrollView>
      <View style={styles.textViewStyle}>
        <Text style={styles.textStyleFrom}>{getText('from')}</Text>
        <Text style={styles.textStyleFacebook}>{getText('facebook')}</Text>
      </View>
    </SafeAreaView>
  );
};

export default UserDetailsScreeen;

const userDetailsScreeenStyle = (colors: ColorProps) =>
  StyleSheet.create({
    backRTLStyle: { transform: [{ rotate: '180deg' }] },
    textViewStyle: { marginTop: 10, alignItems: 'center' },
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
      fontWeight: 'bold',
      textAlign: 'center',
      color: colors.white,
    },
    btnStyle: {
      padding: 10,
      borderRadius: 6,
      marginVertical: 10,
      backgroundColor: colors.primaryblue,
    },

    textDarkStyle: {
      fontSize: fs(25),
      fontWeight: '600',
      color: colors.text,
      textAlign: 'center',
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
    logoView: {
      marginVertical: 10,
      alignSelf: 'center',
    },
    errorText: {
      fontSize: fs(15),
      fontWeight: '800',
      color: colors.declineBtnStyle,
    },
    backButtonStyle: {
      marginBottom: 5,
    },
  });
