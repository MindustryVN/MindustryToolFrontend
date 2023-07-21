import axios from 'axios';

import { API_BASE_URL } from './config/Config';

export class API {
	static REQUEST = axios.create({
		baseURL: API_BASE_URL,
		headers: { 'ngrok-skip-browser-warning': 'true' },
	});

	static setBearerToken(token: string) {
		API.REQUEST = axios.create({
			baseURL: API_BASE_URL,
			headers: {
				'ngrok-skip-browser-warning': 'true',
				Authorization: 'Bearer ' + token,
			},
		});
	}

	static postNotification(userId: string, message: string) {
		let form = new FormData();
		form.append('userId', userId);
		form.append('message', message);
		return API.REQUEST.post('notification', form);
	}
}
