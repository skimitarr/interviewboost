import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './en.json';
import ru from './ru.json';
import ua from './ua.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: en,
            },
            ru: {
                translation: ru,
            },
            ua: {
              translation: ua,
          },
        },
        lng: 'ua',
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
