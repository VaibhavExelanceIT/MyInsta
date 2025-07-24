import {
  I18nManager,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import React from 'react';

import { LanguageConstant } from '../constants/language_constants';

import { useTranslation } from 'react-i18next';
import i18n from '../constants/language/i18next';

import RNRestart from 'react-native-restart';
import { lightTheme } from '../theme/lightTheme';
import { darkTheme } from '../theme/darkTheme';

const LoginScreen = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.text, { color: theme.text }]}>
        {t(LanguageConstant.settings)}
      </Text>
      <Text style={[styles.text, { color: theme.text }]}>
        {t(LanguageConstant.book)}
      </Text>
      <Text style={[styles.text, { color: theme.text }]}>
        {t(LanguageConstant.english)}
      </Text>
      <Text style={[styles.text, { color: theme.text }]}>
        {t(LanguageConstant.home)}
      </Text>
      <Text style={[styles.text, { color: theme.text }]}>
        {t(LanguageConstant.changeLanguage)}
      </Text>
      <Text style={[styles.text, { color: theme.text }]}>
        {t(LanguageConstant.login)}
      </Text>
      <TouchableOpacity
        style={styles.btnstyle}
        onPress={() => {
          i18n
            .changeLanguage(i18n.language === 'ar' ? 'en' : 'ar')
            .then(() => {
              RNRestart.Restart();
              I18nManager.forceRTL(i18n.language === 'ar');
            })
            .catch(() => {
              console.log('something went wrong while applying RTL');
            });
        }}
      >
        <Text>{t(LanguageConstant.changeLanguage)}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  btnstyle: {
    marginVertical: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#AEa',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    fontWeight: '500',
    fontSize: 20,
  },
});
