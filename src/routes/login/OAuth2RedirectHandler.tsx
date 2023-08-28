import React from 'react';

import { ACCESS_TOKEN } from 'src/config/Config';
import { Navigate } from 'react-router-dom';
import i18n from 'src/util/I18N';
import { usePopup } from 'src/context/PopupMessageProvider';
import { Utils } from 'src/util/Utils';

export default function OAuth2RedirectHandler() {
	const { addPopup } = usePopup();

	const token = Utils.getUrlParam('token');

	if (token) {
		localStorage.setItem(ACCESS_TOKEN, token);
		console.log({ token: token });
		return <Navigate to={{ pathname: '/home' }} />;
	}

	addPopup(i18n.t('login-fail'), 5, 'error');
	return <Navigate to={{ pathname: '/login' }} />;
}
