import React, { useContext } from 'react';

import { ACCESS_TOKEN } from 'src/config/Config';
import { Navigate } from 'react-router-dom';
import { PopupMessageContext } from 'src/components/provider/PopupMessageProvider';
import i18n from 'src/util/I18N';

export default function OAuth2RedirectHandler() {
	const { addPopupMessage } = useContext(PopupMessageContext);

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

	const error = getUrlParam('error');
	addPopupMessage(i18n.t('error') + ' ' + error, 5, 'error');
	return <Navigate to={{ pathname: '/login' }} />;
}
