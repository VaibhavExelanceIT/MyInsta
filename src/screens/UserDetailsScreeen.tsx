import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  useColorScheme,
} from 'react-native';

import * as Yup from 'yup';
import { t } from 'i18next';
import { Formik } from 'formik';
import firestore from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';
import { useNavigation } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import auth from '@react-native-firebase/auth';

import { darkTheme } from '../theme/darkTheme';
import InputText from '../components/InputText';
import { lightTheme } from '../theme/lightTheme';
import { instadark, instalight } from '../helper/images';
import ButtonComponent from '../components/ButtonComponent';
import { LanguageConstant } from '../constants/language_constants';
import RadioButtonComponent from '../components/RadioButtonComponent';
import { useThemeColors } from '../hooks/useThemeColors';
import { ColorProps } from '../constants/color';

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First Name is Required'),
  lastName: Yup.string().required('Last Name is Required'),
  gender: Yup.string().required('Gender is Required'),
  mobileNo: Yup.string().required('Mobile No is Required').max(10).min(10),
  DOB: Yup.string().required('Date of Birth is Required'),
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
  follower: Array<string>;
  following: Array<string>;
}
const UserDetailsScreeen = ({ route }: any) => {
  const navigation = useNavigation<any>();

  const email: string = route.params.email;
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  const [isDatePickerVisible, setIsDatePickerVisibility] = useState(false);
  const colors = useThemeColors();
  const styles = userDetailsScreeenStyle(colors);
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
            })
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
                type: 'danger',
                message: 'Error',
                description: 'There is some error in the data',
              });
            });
        } else {
          Alert.alert('There is some Error');
        }
      } else {
        showMessage({
          type: 'warning',
          message: 'success',
          description: 'User already Registrated',
        });
        navigation.navigate('loginScreen');
      }
    } catch (error) {
      showMessage({
        type: 'danger',
        message: 'Error',
        description: 'There is some error in the data',
      });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.logoView}>
          <Image source={colorScheme === 'light' ? instadark : instalight} />
        </View>

        <Text style={styles.textDarkStyle}>{'User Details'}</Text>
        <Formik
          initialValues={{
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
            handleSubmit,
            handleChange,
            setFieldValue,
          }) => (
            <>
              <InputText
                placeholder={t(LanguageConstant.firstname)}
                value={values.firstName}
                onChange={handleChange('firstName')}
                onBlur={handleBlur('firstName')}
              />
              {errors.firstName && touched.firstName && (
                <Text style={styles.errorText}>{errors.firstName}</Text>
              )}

              <InputText
                placeholder={t(LanguageConstant.lastname)}
                value={values.lastName}
                onChange={handleChange('lastName')}
                onBlur={handleBlur('lastName')}
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
                  handleChange(setFieldValue('DOB', date.toDateString()));

                  hideDatePicker();
                }}
                onCancel={hideDatePicker}
              />

              {errors.DOB && touched.DOB && (
                <Text style={styles.errorText}>{errors.DOB}</Text>
              )}

              <InputText
                isEditable={false}
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
                title={t(LanguageConstant.login)}
                onClick={handleSubmit}
                btnStyle={styles.btnStyle}
                textStyle={styles.textStyle}
              />
            </>
          )}
        </Formik>
      </ScrollView>
    </View>
  );
};

export default UserDetailsScreeen;

const userDetailsScreeenStyle = (colors: ColorProps) =>
  StyleSheet.create({
    textStyle: {
      fontWeight: 'bold',
      textAlign: 'center',
    },
    btnStyle: {
      padding: 10,
      borderRadius: 6,
      marginVertical: 10,
      backgroundColor: colors.primaryblue,
    },

    textDarkStyle: {
      fontSize: 30,
      color: colors.white,
      fontWeight: '600',
      textAlign: 'center',
      textDecorationLine: 'underline',
      textDecorationColor: colors.white,
    },

    container: {
      backgroundColor: colors.background,
      flex: 1,
      padding: 20,
      height: '80%',
      justifyContent: 'center',
    },
    logoView: {
      marginBottom: 10,
      alignSelf: 'center',
    },
    errorText: {
      color: 'red',
      fontSize: 15,
      fontWeight: '800',
    },
  });
