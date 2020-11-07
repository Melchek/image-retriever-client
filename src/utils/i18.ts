import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './../assets/locales/en.json'
import he from './../assets/locales/he.json'

// The translations
const resources = {
    'en-US': en,
    he
}

i18n
    .use(LanguageDetector) // Passes i18n down to react-i18next
    .use(initReactI18next) // Passes i18n down to react-i18next
    .init({
        resources,
        fallbackLng: 'en-US',
        debug: true,

        keySeparator: '.',

        interpolation: {
            escapeValue: false // React already safes from xss
        }
    });

export default i18n;
