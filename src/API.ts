import axios from 'axios';

import { API_BASE_URL } from './config/Config';
import Schematic from 'src/data/Schematic';

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

	static postNotification(userId: string,header: string, message: string) {
		let form = new FormData();
		form.append('userId', userId);
		form.append("header", header)
		form.append('message', message);
		return API.REQUEST.post('notification', form);
	}

	static verifySchematic(schematic: Schematic, tagString: string) {
		let form = new FormData();

		form.append('id', schematic.id);
		form.append('authorId', schematic.authorId);
		form.append('data', schematic.data);
		form.append('tags', tagString);

		return API.REQUEST.post('schematic', form);
	}

	static postComment(url: string, targetId: string, message: string) {
		let form = new FormData();
		
		form.append('message', message);
		form.append('targetId', targetId);

		return API.REQUEST.post(url, form);
	}
}
