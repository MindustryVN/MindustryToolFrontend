import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import vi from '../locales/vi.json';
import en from '../locales/en.json';

const resources = {
	vi: { translation: vi },
	en: { translation: en }
};

i18n.use(Backend)
	.use(initReactI18next)
	.init({
		resources: resources,
		fallbackLng: 'vi',
		debug: true,
		interpolation: {
			escapeValue: false
		}
	});

export default i18n;
