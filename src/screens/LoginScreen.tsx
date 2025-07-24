import {
  I18nManager,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { lightTheme } from '../theme/lightTheme';
import { darkTheme } from '../theme/darkTheme';
import DropDownPicker from 'react-native-dropdown-picker';
import i18n from '../constants/language/i18next';
import { LanguageConstant } from '../constants/language_constants';

import RNRestart from 'react-native-restart';
import {
  googlelogo,
  instadark,
  instalight,
  microsoftlogo,
} from '../helper/images';
import InputText from '../components/InputText';
import ButtonComponent from '../components/ButtonComponent';

const LoginScreen = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<any>();
  const [items, setItems] = useState([
    { label: t(LanguageConstant.english), value: 'en' },
    { label: t(LanguageConstant.hindi), value: 'hi' },
    { label: t(LanguageConstant.urdu), value: 'ar' },
  ]);

  colorScheme === 'dark'
    ? DropDownPicker.setTheme('DARK')
    : DropDownPicker.setTheme('LIGHT');

  const changeLanguage = (lng: string) => {
    switch (lng) {
      case 'ar':
        i18n.changeLanguage('ar').then(() => {
          // AsyncStorage.setItem('lng', 'ar');
          I18nManager.allowRTL(true);
          I18nManager.forceRTL(true);
          RNRestart.Restart();
        });
        break;

      case 'en':
        i18n.changeLanguage('en').then(() => {
          // AsyncStorage.setItem('lng', 'en');
          I18nManager.allowRTL(false);
          I18nManager.forceRTL(false);
          RNRestart.Restart();
        });
        break;

      case 'hi':
        i18n.changeLanguage('hi').then(() => {
          // AsyncStorage.setItem('lng', 'ur');
          I18nManager.allowRTL(false);
          I18nManager.forceRTL(false);
          RNRestart.Restart();
        });
        break;

      default:
        return null;
    }
    // i18n
    //   .changeLanguage(value)
    //   .then(() => {
    //     console.log(value);
    //     RNRestart.Restart();
    //     I18nManager.forceRTL(i18n.language === 'ar');
    //   })
    //   .catch(() => {
    //     console.log('something went wrong while applying RTL');
    //   });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.dropdownView}>
        <DropDownPicker
          open={open}
          value={value}
          showBadgeDot={true}
          itemSeparator={true}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          placeholder={'English'}
          containerStyle={styles.dropdowncontainer}
          style={styles.dropdownstyle}
          onChangeValue={() => changeLanguage(value)}
        />
      </View>

      <View style={styles.logoView}>
        <Image source={colorScheme === 'light' ? instadark : instalight} />
      </View>

      <View style={styles.formView}>
        <InputText PlaceHolder={t(LanguageConstant.email)} />
        <InputText PlaceHolder={t(LanguageConstant.password)} />
        <TouchableOpacity style={styles.forgetbuttonstyle}>
          <Text style={styles.forgettextstyle}>
            {t(LanguageConstant.forgetPassword)}
          </Text>
        </TouchableOpacity>

        <ButtonComponent title={t(LanguageConstant.login)} onclick={() => {}} />

        <View style={styles.signupview}>
          <Text style={colorScheme === 'dark' ? styles.darkViewText : {}}>
            {t(LanguageConstant.doNotHaveAccount)}
          </Text>
          <TouchableOpacity>
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
          OR
        </Text>
        <View style={styles.dashstyle} />
      </View>

      <View style={styles.socialView}>
        <View style={styles.sociallogoView}>
          <TouchableOpacity onPress={() => {}}>
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
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  darkThemeFaceBookStyle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
  },
  darkViewText: { color: '#FFFFFF' },
  textStylefrom: { fontSize: 14, fontWeight: '600', color: '#AEA9A9' },
  textStylefacebook: { fontSize: 16, fontWeight: '400', color: '#070000' },
  textviewstyle: { margin: 20, alignItems: 'center' },
  sociallogoView: {
    flexDirection: 'row',
    margin: 20,
    justifyContent: 'center',
  },
  socialView: {
    flex: 2,
    justifyContent: 'space-between',
  },
  sociallogo: { height: 30, width: 30, marginHorizontal: 10 },
  orstyle: { flex: 0.6, textAlign: 'center' },

  dashstyle: {
    borderWidth: 0.8,
    flex: 1,
    height: 0,
    marginTop: 10,
    borderColor: '#CCCCCC',
  },
  signupview: { flexDirection: 'row', justifyContent: 'center' },
  signupstyle: { color: '#1877F2', fontWeight: '700' },
  forgettextstyle: { color: '#1877F2', fontWeight: '700', fontSize: 13 },
  forgetbuttonstyle: { alignSelf: 'flex-end' },
  dropdownstyle: { borderWidth: 0 },
  googleView: {
    // flex: 5,
    paddingHorizontal: 50,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  formView: {
    flex: 2,
    paddingHorizontal: 50,
    justifyContent: 'space-evenly',
  },
  logoView: {
    // flex: 1,
    alignSelf: 'center',
  },
  dropdowncontainer: {
    width: '25%',
    flex: 1,
    alignSelf: 'center',
    borderWidth: 0,
    color: '#C5C5C5',
  },
  dropdownView: {
    alignItems: 'center',
    flex: 1,
    padding: 20,
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
});
