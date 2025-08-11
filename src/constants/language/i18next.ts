import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';

import english from './en.json';
import hindi from './hi.json';
import arabic from './ar.json';

i18n.use(initReactI18next).init({
  initImmediate: false,
  resources: {
    en: {
      translation: english,
    },
    hi: {
      translation: hindi,
    },
    ar: {
      translation: arabic,
    },
  },
  lng: I18nManager.isRTL ? 'ar' : 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});
export default i18n;
