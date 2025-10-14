import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';

import english from './en.json';
import hindi from './hi.json';
import arabic from './ar.json';

const resources = {
  hi: { translation: hindi },
  ar: { translation: arabic },
  en: { translation: english },
};

const loadSavedLanguage = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem('user-language');
    return savedLanguage;
  } catch (error) {
    return null;
  }
};

export const getText = (text: string) => {
  return i18n.t(text);
};

const initializeI18n = async () => {
  const locales = RNLocalize.getLocales();
  const savedLanguage = await loadSavedLanguage();
  const deviceLanguage = locales[0]?.languageTag.split('-')[0];

  i18n.use(initReactI18next).init({
    initImmediate: false,
    resources,
    lng: savedLanguage || deviceLanguage || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

  I18nManager.forceRTL(i18n.language === 'ar');
};

initializeI18n();

export default i18n;
