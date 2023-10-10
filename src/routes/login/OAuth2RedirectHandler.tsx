import React from 'react';

import { ACCESS_TOKEN } from 'src/config/Config';
import { Navigate } from 'react-router-dom';
import i18n from 'src/util/I18N';
import { usePopup } from 'src/context/PopupMessageProvider';
import { getUrlParam } from 'src/util/Utils';
import { useMe } from 'src/context/MeProvider';

export default function OAuth2RedirectHandler() {
	const addPopup = usePopup();
	const { login } = useMe();

	const token = getUrlParam('token');

	if (token) {
		localStorage.setItem(ACCESS_TOKEN, token);
		login();

		return (
			<div className='flex h-full w-full items-center justify-center'>
				You're not suppose to be here
				<Navigate to={{ pathname: '/home' }} />;
			</div>
		);
	}

	addPopup(i18n.t('login-fail'), 5, 'error');
	return <Navigate to={{ pathname: '/login' }} />;
}
