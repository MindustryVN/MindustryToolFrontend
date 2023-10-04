import axios, { AxiosRequestConfig } from 'axios';

import { API_BASE_URL } from './config/Config';
import Schematic from 'src/data/Schematic';
import Map from 'src/data/Map';
import { TagChoice, Tags } from 'src/components/Tag';

export class API {
	static REQUEST = axios.create({
		baseURL: API_BASE_URL,
		timeout: 600000,
	});

	static SECURE_REQUEST = this.REQUEST;

	static setBearerToken(token: string) {
		API.SECURE_REQUEST = axios.create({
			baseURL: API_BASE_URL,
			headers: {
				Authorization: 'Bearer ' + token,
			},
			timeout: 600000,
		});
	}
	static get(url: string, searchConfig?: AxiosRequestConfig<any>) {
		return API.SECURE_REQUEST.get(url, searchConfig);
	}

	static getTotalSchematic(searchConfig?: AxiosRequestConfig<any>) {
		return API.REQUEST.get('schematic/total', searchConfig);
	}

	static getTotalSchematicUpload() {
		return API.SECURE_REQUEST.get('schematic-upload/total');
	}

	static getTotalMap(searchConfig?: AxiosRequestConfig<any>) {
		return API.REQUEST.get('map/total', searchConfig);
	}

	static getTotalMapUpload() {
		return API.SECURE_REQUEST.get('map-upload/total');
	}

	static getTotalPostUpload() {
		return API.SECURE_REQUEST.get('post-upload/total');
	}

	static postNotification(userId: string, header: string, message: string) {
		let form = new FormData();
		form.append('userId', userId);
		form.append('header', header);
		form.append('message', message);
		return API.SECURE_REQUEST.post('notification', form);
	}

	static markAsReadNotificationAll() {
		return API.SECURE_REQUEST.put('notification/all');
	}

	static deleteNotificationAll() {
		return API.SECURE_REQUEST.delete('notification/all');
	}

	static verifySchematic(schematic: Schematic, tags: TagChoice[]) {
		let form = new FormData();

		const tagString = Tags.toString(tags);

		form.append('id', schematic.id);
		form.append('tags', tagString);

		return API.SECURE_REQUEST.post('schematic', form);
	}

	static rejectSchematic(schematic: Schematic, reason: string) {
		return API.SECURE_REQUEST.delete(`schematic-upload/${schematic.id}`) //
			.then(() => API.postNotification(schematic.authorId, 'Your map submission has been reject', reason));
	}

	static verifyMap(map: Map, tags: TagChoice[]) {
		let form = new FormData();

		const tagString = Tags.toString(tags);

		form.append('id', map.id);
		form.append('tags', tagString);

		return API.SECURE_REQUEST.post('map', form);
	}

	static rejectMap(map: Map, reason: string) {
		return API.SECURE_REQUEST.delete(`map-upload/${map.id}`) //
			.then(() => API.postNotification(map.authorId, 'Your map submission has been reject', reason));
	}

	static postComment(url: string, targetId: string, content: string, contentType: string) {
		let form = new FormData();

		form.append('targetId', targetId);
		form.append('content', content);
		form.append('contentType', contentType);

		return API.SECURE_REQUEST.post(url, form);
	}

	static deleteComment(contentType: string, commentId: string) {
		return API.SECURE_REQUEST.delete(`comment/${contentType}/${commentId}`);
	}

	static getTagByName(tag: string) {
		return API.REQUEST.get(`tag/${tag}`);
	}

	static getUser(userId: string) {
		return API.REQUEST.get(`/user/${userId}`);
	}

	static getMe() {
		return API.SECURE_REQUEST.get('/user/me');
	}

	static getUnreadNotification() {
		return API.SECURE_REQUEST.get('notification/unread'); //
	}

	static getPing() {
		return API.REQUEST.get('ping'); //
	}

	static getLikes(contentType: string, targetId: string) {
		return API.SECURE_REQUEST.get(`like/${contentType}/${targetId}/likes`);
	}

	static setLike(contentType: string, targetId: string) {
		return API.SECURE_REQUEST.get(`like/${contentType}/${targetId}/like`);
	}

	static setDislike(contentType: string, targetId: string) {
		return API.SECURE_REQUEST.get(`like/${contentType}/${targetId}/dislike`);
	}

	static deleteLog(contentType: string, logId: string) {
		return API.SECURE_REQUEST.delete(`log/${contentType}/${logId}`); //
	}

	static markNotificationAsRead(notificationId: string) {
		return API.SECURE_REQUEST.put(`notification/${notificationId}`); //
	}

	static deleteNotification(notificationId: string) {
		return API.SECURE_REQUEST.delete(`notification/${notificationId}`);
	}

	static deleteSchematic(schematicId: string) {
		return API.SECURE_REQUEST.delete(`schematic/${schematicId}`); //
	}

	static deleteMap(mapId: string) {
		return API.SECURE_REQUEST.delete(`map/${mapId}`); //
	}

	static getSchematicPreview(code: string, file: File | undefined) {
		const form = new FormData();
		if (file) form.append('file', file);
		else form.append('code', code);

		return API.SECURE_REQUEST.post('schematic-upload/preview', form);
	}

	static getMapPreview(file: File | undefined) {
		const form = new FormData();
		if (file) form.append('file', file);

		return API.SECURE_REQUEST.post('map-upload/preview', form);
	}

	static postSchematicUpload(code: string, file: File | undefined, tags: TagChoice[]) {
		const formData = new FormData();

		const tagString = Tags.toString(tags);

		formData.append('tags', tagString);

		if (file) formData.append('file', file);

		formData.append('code', code);

		return API.SECURE_REQUEST.post('schematic-upload', formData);
	}

	static postMapUpload(file: File, tags: TagChoice[]) {
		const formData = new FormData();

		const tagString = Tags.toString(tags);

		formData.append('tags', tagString);

		formData.append('file', file);

		return API.SECURE_REQUEST.post('map-upload', formData);
	}

	static postMindustryServer(address: string) {
		const form = new FormData();
		form.append('address', address);

		return API.REQUEST.post('mindustry-server', form);
	}

	static deleteServer(address: string) {
		return this.SECURE_REQUEST.delete(`mindustry-server/${address}`);
	}

	static postPost(title: string, content: string, tags: TagChoice[]) {
		const form = new FormData();
		form.append('header', title);
		form.append('content', content);

		const tagString = Tags.toString(tags);

		form.append('tags', tagString);

		return this.SECURE_REQUEST.post('post-upload', form);
	}

	static verifyPost(post: Post, tags: TagChoice[]) {
		let form = new FormData();

		const tagString = Tags.toString(tags);

		form.append('id', post.id);
		form.append('content', post.content);
		form.append('tags', tagString);

		return API.SECURE_REQUEST.post('post', form);
	}

	static rejectPost(post: Post, reason: string) {
		return API.SECURE_REQUEST.delete(`post-upload/${post.id}`) //
			.then(() => API.postNotification(post.authorId, 'Your post submission has been reject', reason));
	}

	static deletePost(postId: string) {
		return API.SECURE_REQUEST.delete(`post/${postId}`); //
	}

	static getMetric(start: Date, end: Date, collection: string) {
		return API.SECURE_REQUEST.get('metric', {
			params: {
				start: start.toISOString(),
				end: end.toISOString(),
				collection: collection,
			},
		});
	}
}
