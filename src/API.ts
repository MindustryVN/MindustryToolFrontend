import axios, { AxiosRequestConfig } from 'axios';

import { API_BASE_URL } from './config/Config';
import Schematic from 'src/data/Schematic';
import Map from 'src/data/Map';
import { TagChoice, Tags } from 'src/components/Tag';

export class API {
	static REQUEST = axios.create({
		baseURL: API_BASE_URL,
		headers: { 'ngrok-skip-browser-warning': 'true' },
		timeout: 600000,
	});

	static setBearerToken(token: string) {
		API.REQUEST = axios.create({
			baseURL: API_BASE_URL,
			headers: {
				'ngrok-skip-browser-warning': 'true',
				Authorization: 'Bearer ' + token,
			},
			timeout: 600000,
		});
	}
	static get(url: string, searchConfig?: AxiosRequestConfig<any>) {
		return API.REQUEST.get(url, searchConfig);
	}

	static getTotalSchematic(searchConfig?: AxiosRequestConfig<any>) {
		return API.REQUEST.get('schematic/total', searchConfig);
	}

	static getTotalSchematicUpload() {
		return API.REQUEST.get('schematic-upload/total');
	}

	static getTotalMap(searchConfig?: AxiosRequestConfig<any>) {
		return API.REQUEST.get('map/total', searchConfig);
	}

	static getTotalMapUpload() {
		return API.REQUEST.get('map-upload/total');
	}

	static postNotification(userId: string, header: string, message: string) {
		let form = new FormData();
		form.append('userId', userId);
		form.append('header', header);
		form.append('message', message);
		return API.REQUEST.post('notification', form);
	}

	static markAsReadNotificationAll() {
		return API.REQUEST.put('notification/all');
	}

	static deleteNotificationAll() {
		return API.REQUEST.delete('notification/all');
	}

	static verifySchematic(schematic: Schematic, tags: TagChoice[]) {
		let form = new FormData();

		const tagString = Tags.toString(tags);

		form.append('id', schematic.id);
		form.append('tags', tagString);

		return API.REQUEST.post('schematic', form);
	}

	static rejectSchematic(schematic: Schematic, reason: string) {
		return API.REQUEST.delete(`schematic-upload/${schematic.id}`) //
			.then(() => API.postNotification(schematic.authorId, 'Your map submission has been reject', reason));
	}

	static verifyMap(map: Map, tags: TagChoice[]) {
		let form = new FormData();

		const tagString = Tags.toString(tags);

		form.append('id', map.id);
		form.append('tags', tagString);

		return API.REQUEST.post('map', form);
	}

	static rejectMap(map: Map, reason: string) {
		return API.REQUEST.delete(`map-upload/${map.id}`) //
			.then(() => API.postNotification(map.authorId, 'Your map submission has been reject', reason));
	}

	static postComment(url: string, targetId: string, content: string, contentType: string) {
		let form = new FormData();

		form.append('targetId', targetId);
		form.append('content', content);
		form.append('contentType', contentType);

		return API.REQUEST.post(url, form);
	}

	static deleteComment(contentType: string, commentId: string) {
		return API.REQUEST.delete(`comment/${contentType}/${commentId}`);
	}

	static getTagByName(tag: string) {
		return API.REQUEST.get(`tag/${tag}`);
	}

	static getUser(userId: string) {
		return API.REQUEST.get(`/user/${userId}`);
	}

	static getMe() {
		return API.REQUEST.get('/user/me');
	}

	static getUnreadNotification() {
		return API.REQUEST.get('notification/unread'); //
	}

	static getPing() {
		return API.REQUEST.get('ping'); //
	}

	static getLikes(contentType: string, targetId: string) {
		return API.REQUEST.get(`like/${contentType}/${targetId}/likes`);
	}

	static setLike(contentType: string, targetId: string) {
		return API.REQUEST.get(`like/${contentType}/${targetId}/like`);
	}

	static setDislike(contentType: string, targetId: string) {
		return API.REQUEST.get(`like/${contentType}/${targetId}/dislike`);
	}

	static deleteLog(contentType: string, logId: string) {
		return API.REQUEST.delete(`log/${contentType}/${logId}`); //
	}

	static markNotificationAsRead(notificationId: string) {
		return API.REQUEST.put(`notification/${notificationId}`); //
	}

	static deleteNotification(notificationId: string) {
		return API.REQUEST.delete(`notification/${notificationId}`);
	}

	static deleteSchematic(schematicId: string) {
		return API.REQUEST.delete(`schematic/${schematicId}`); //
	}

	static deleteMap(mapId: string) {
		return API.REQUEST.delete(`map/${mapId}`); //
	}

	static getSchematicPreview(code: string, file: File | undefined) {
		const form = new FormData();
		if (file) form.append('file', file);
		else form.append('code', code);

		return API.REQUEST.post('schematic-upload/preview', form);
	}

	static getMapPreview(file: File | undefined) {
		const form = new FormData();
		if (file) form.append('file', file);

		return API.REQUEST.post('map-upload/preview', form, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
	}

	static postSchematicUpload(code: string, file: File | undefined, tags: TagChoice[]) {
		const formData = new FormData();

		const tagString = Tags.toString(tags);

		formData.append('tags', tagString);

		if (file) formData.append('file', file);

		formData.append('code', code);

		return API.REQUEST.post('schematic-upload', formData);
	}

	static postMapUpload(file: File, tags: TagChoice[]) {
		const formData = new FormData();

		const tagString = Tags.toString(tags);

		formData.append('tags', tagString);

		formData.append('file', file);

		return API.REQUEST.post('map-upload', formData);
	}

	static postMindustryServer(address: string) {
		const form = new FormData();
		form.append('address', address);

		return API.REQUEST.post('mindustry-server', form);
	}

	static deleteServer(address: string) {
		return this.REQUEST.delete(`mindustry-server/${address}`);
	}

	static postPost(title: string, content: string, tags: TagChoice[]) {
		const form = new FormData();
		form.append('header', title);
		form.append('content', content);

		const tagString = Tags.toString(tags);

		form.append('tags', tagString);

		return this.REQUEST.post('post-upload', form);
	}

	static verifyPost(post: Post, tags: TagChoice[]) {
		let form = new FormData();

		const tagString = Tags.toString(tags);

		form.append('id', post.id);
		form.append('content', post.content);
		form.append('tags', tagString);

		return API.REQUEST.post('post', form);
	}

	static rejectPost(post: Post, reason: string) {
		return API.REQUEST.delete(`post-upload/${post.id}`) //
			.then(() => API.postNotification(post.authorId, 'Your post submission has been reject', reason));
	}

	static deletePost(postId: string) {
		return API.REQUEST.delete(`post/${postId}`); //
	}
}
