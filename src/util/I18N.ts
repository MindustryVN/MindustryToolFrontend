import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';

import vi from '../locales/vi.json';
import en from '../locales/en.json';

const resources = {
	vi: { translation: vi },
	en: { translation: en },
};

i18n.use(Backend)
	.use(I18nextBrowserLanguageDetector)
	.use(initReactI18next)
	.init({
		resources: resources,
		fallbackLng: 'en',
		debug: true,
		interpolation: {
			escapeValue: false,
		},
	});

i18n.changeLanguage();

export default i18n;
