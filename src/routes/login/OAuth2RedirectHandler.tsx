import React, { Component } from 'react';

import { ACCESS_TOKEN } from 'src/config/Config';
import { Navigate } from 'react-router-dom';

export default class OAuth2RedirectHandler extends Component {
	getUrlParam(name: string): string {
		name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
		var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');

		var results = regex.exec(window.location.search);
		return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
	}

	render() {
		const token = this.getUrlParam('token');

		if (token) {
			localStorage.setItem(ACCESS_TOKEN, token);
			return <Navigate to={{ pathname: '/home' }} />;
		}

		const error = this.getUrlParam('error');
		console.log(error);
		return <Navigate to={{ pathname: '/login' }} />;
	}
}
