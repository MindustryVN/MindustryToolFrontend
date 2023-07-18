import React from 'react';

import { ACCESS_TOKEN } from 'src/config/Config';
import { Navigate } from 'react-router-dom';
import i18n from 'src/util/I18N';
import usePopup from 'src/hooks/UsePopup';

export default function OAuth2RedirectHandler() {
	const { addPopup } = usePopup();

	function getUrlParam(name: string): string {
		name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
		var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');

		var results = regex.exec(window.location.search);
		return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
	}

	const token = getUrlParam('token');

	if (token) {
		localStorage.setItem(ACCESS_TOKEN, token);
		return <Navigate to={{ pathname: '/home' }} />;
	}

	addPopup(i18n.t('login-fail') , 5, 'error');
	return <Navigate to={{ pathname: '/login' }} />;
}
