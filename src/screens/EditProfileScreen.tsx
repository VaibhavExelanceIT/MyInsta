import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
} from 'react-native';

import * as Yup from 'yup';

import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import firestore from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import { fs } from '../helper/fontSize';
import { useTheme } from '../hooks/useTheme';
import { ArrayUrl } from '../helper/imagesUrl';
import InputText from '../components/InputText';
import { ColorProps } from '../constants/color';
import { getText } from '../constants/language/i18next';
import { instadark, instalight } from '../helper/images';
import { useThemeColors } from '../hooks/useThemeColors';
import ButtonComponent from '../components/ButtonComponent';
import LoaderComponent from '../components/LoaderComponent';
import { BackArrowDark, BackArrowLight } from '../helper/icon';

interface userData {
  DOB: string;
  lastName: string;
  firstName: string;
  userImage?: string;
}

const getSchemas = () => {
  const firstName = Yup.string().required(getText('firstNameRequiredError'));
  const lastName = Yup.string().required(getText('lastNameRequiredError'));
  const DOB = Yup.string().required(getText('dobRequired'));

  return {
    EditProfileValidationSchema: Yup.object({ firstName, lastName, DOB }),
  };
};
const EditProfileScreen = ({ route }: any) => {
  const [schemas, setSchemas] = useState(getSchemas());

  const { i18n } = useTranslation();

  const isRTL = I18nManager.isRTL;
  useEffect(() => {
    const handleLanguageChange = () => {
      const newSchemas = getSchemas();
      setSchemas(newSchemas);

      formik.resetForm({ values: formik.values });
    };

    i18n.on('languageChanged', handleLanguageChange);
    return () => i18n.off('languageChanged', handleLanguageChange);
  }, []);

  const userId: string = route.params.userId;

  const navigation = useNavigation<any>();
  const colors = useThemeColors();

  const { isDarkMode } = useTheme();

  const [isDatePickerVisible, setIsDatePickerVisibility] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const currentDate = new Date();

  const goBackHandler = () => {
    navigation.goBack();
  };

  const showDatePicker = () => {
    setIsDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setIsDatePickerVisibility(false);
  };

  const updateUserData = async (values: userData) => {
    try {
      await firestore().collection('UsersData').doc(userId).update({
        firstName: values.firstName,
        lastName: values.lastName,
        DOB: values.DOB,
        userImage: values.userImage,
      });
      setIsLoading(false);
      setIsModalVisible(false);
      navigation.goBack();
      showMessage({
        message: getText('profileUpdated'),
        type: 'success',
      });
    } catch (error) {
      setIsLoading(false);
      setIsModalVisible(false);
      showMessage({
        message: getText('error'),
        type: 'danger',
      });
    }
  };
  const randomIndex = Math.floor(Math.random() * ArrayUrl.length);

  const formik = useFormik({
    initialValues: {
      userImage: ArrayUrl[randomIndex],
      DOB: '',
      lastName: '',
      firstName: '',
    },

    onSubmit: values => {
      setIsLoading(true);
      setIsModalVisible(true);
      updateUserData(values);
    },
    validationSchema: schemas.EditProfileValidationSchema,
  });
  const styles = EditProfileStyle(colors);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.backButtonStyle}>
        {isDarkMode ? (
          <TouchableOpacity onPress={goBackHandler}>
            <BackArrowLight
              height={20}
              width={20}
              style={isRTL && styles.backRTLStyle}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={goBackHandler}>
            <BackArrowDark
              height={20}
              width={20}
              style={isRTL && styles.backRTLStyle}
            />
          </TouchableOpacity>
        )}
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.logoView}>
          <Image source={isDarkMode ? instalight : instadark} />
        </View>

        <Text style={styles.textDarkStyle}>{getText('updateUserDeatils')}</Text>

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

        <ButtonComponent
          title={getText('submit')}
          onClick={formik.handleSubmit}
          btnStyle={styles.btnStyle}
          textStyle={styles.textStyle}
        />

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

export default EditProfileScreen;

const EditProfileStyle = (colors: ColorProps) =>
  StyleSheet.create({
    backRTLStyle: { transform: [{ rotate: '180deg' }] },
    textStyle: {
      color: colors.white,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    btnStyle: {
      padding: 10,
      borderRadius: 6,
      marginVertical: 10,
      backgroundColor: colors.primaryblue,
    },
    textViewStyle: { marginTop: 10, alignItems: 'center' },
    textDarkStyle: {
      fontSize: fs(25),
      color: colors.text,
      fontWeight: '600',
      textAlign: 'center',
      textDecorationLine: 'underline',
      textDecorationColor: colors.text,
    },
    container: {
      backgroundColor: colors.background,
      flex: 1,
      padding: 20,
      height: '80%',
      justifyContent: 'center',
    },
    backButtonStyle: {
      marginBottom: 5,
    },
    logoView: {
      marginVertical: 10,
      alignSelf: 'center',
    },
    textStyleFacebook: {
      fontSize: fs(16),
      fontWeight: '400',
      color: colors.text,
    },
    errorText: {
      color: 'red',
      fontSize: fs(15),
      fontWeight: '800',
    },
    textStyleFrom: {
      fontSize: fs(14),
      fontWeight: '600',
      color: colors.fromcolor,
    },
  });
