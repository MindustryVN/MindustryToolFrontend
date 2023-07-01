import axios from 'axios';

import { API_BASE_URL } from './config/Config';

import { setupCache } from 'axios-cache-interceptor';

export class API {
	static REQUEST = setupCache(
		axios.create({
			baseURL: API_BASE_URL,
			headers: { 'ngrok-skip-browser-warning': 'true' }
		})
	);

	static setBearerToken(token: string) {
		API.REQUEST = setupCache(
			axios.create({
				baseURL: API_BASE_URL,
				headers: { 'ngrok-skip-browser-warning': 'true', Authorization: 'Bearer ' + token }
			})
		);
	}
}
