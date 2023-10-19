import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },
    },
    lng: 'en',
    nsSeparator: false,
    load: 'currentOnly',
    react: {
      useSuspense: true,
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
