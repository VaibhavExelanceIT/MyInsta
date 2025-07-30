import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';

import * as Yup from 'yup';
import { t } from 'i18next';
import { Formik } from 'formik';
import firestore from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {
  getAuth,
  createUserWithEmailAndPassword,
} from '@react-native-firebase/auth';

import { darkTheme } from '../theme/darkTheme';
import InputText from '../components/InputText';
import { lightTheme } from '../theme/lightTheme';
import { instadark, instalight } from '../helper/images';
import ButtonComponent from '../components/ButtonComponent';
import { LanguageConstant } from '../constants/language_constants';
import RadioButtonComponent from '../components/RadioButtonComponent';

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
}
const UserDetailsScreeen = ({ route }: any) => {
  const email: string = route.params.email;

  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  console.log(email);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

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
          email: values.email,
          gender: values.gender,
          mobileNo: values.mobileNo,
          lastName: values.lastName,
          firstName: values.firstName,
        })
        .then(() => {
          createUserWithEmailAndPassword(
            getAuth(),
            values.email,
            values.password,
          )
            .then(() => {
              console.log('User account created & signed in!');
            })
            .catch(error => {
              if (error.code === 'auth/email-already-in-use') {
                console.log('That email address is already in use!');
              }

              if (error.code === 'auth/invalid-email') {
                console.log('That email address is invalid!');
              }

              console.error(error);
            });
          console.log(values);
          showMessage({
            type: 'success',
            message: 'success',
            description: 'User Data Addedd',
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
          {'User Details'}
        </Text>
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
            handleSubmit,
            handleChange,
            setFieldValue,
          }) => (
            <>
              <InputText
                PlaceHolder={t(LanguageConstant.firstname)}
                value={values.firstName}
                onChange={handleChange('firstName')}
                onBlur={handleBlur('firstName')}
              />
              {errors.firstName && touched.firstName && (
                <Text style={styles.errorText}>{errors.firstName}</Text>
              )}

              <InputText
                PlaceHolder={t(LanguageConstant.lastname)}
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
                  handleChange(setFieldValue('DOB', date.toDateString()));
                  console.log(date.toDateString());
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
                title={t(LanguageConstant.login)}
                onclick={handleSubmit}
              />
            </>
          )}
        </Formik>
      </ScrollView>
    </View>
  );
};

export default UserDetailsScreeen;

const styles = StyleSheet.create({
  radiobtnView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  genderTextStyle: {
    color: '#FFFFFF',
  },
  textStyle: {
    color: '#FFFFFF',
  },
  textDarkStyle: {
    fontSize: 30,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
    textDecorationLine: 'underline',
    textDecorationColor: '#FFFFFF',
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
  logoView: {
    marginBottom: 10,
    alignSelf: 'center',
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
    width: '90%',
    padding: 30,
    elevation: 5,
    shadowRadius: 4,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    backgroundColor: 'white',
  },
});
