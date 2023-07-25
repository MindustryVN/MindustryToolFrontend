import './NotificationPage.css';
import 'src/styles.css';

import { Trans } from 'react-i18next';
import { API } from 'src/API';

import React from 'react';
import usePage from 'src/hooks/UsePage';
import Notification from 'src/data/Notification';
import LoadingSpinner from 'src/components/loader/LoadingSpinner';
import IconButton from 'src/components/button/IconButton';
import usePopup from 'src/hooks/UsePopup';
import i18n from 'src/util/I18N';
import IfTrue from 'src/components/common/IfTrue';
import Markdown from 'src/components/markdown/Markdown';
import PrivateRoute from 'src/components/router/PrivateRoute';
import useNotification from 'src/hooks/UseNotification';

export default function NotificationPage() {
	return <PrivateRoute element={<NotificationContainer />} />;
}

function NotificationContainer() {
	const { pages, isLoading, reloadPage } = usePage<Notification>('notification/page');

	const { setUnreadNotifications } = useNotification();

	const { addPopup } = usePopup();

	function handleMarkAsRead(notification: Notification) {
		API.REQUEST.put(`notification/${notification.id}`) //
			.then(() => addPopup(i18n.t('mark-as-read'), 5, 'info'))
			.then(() => (notification.read = true))
			.then(() => setUnreadNotifications((prev) => prev - 1))
			.catch(() => addPopup(i18n.t('action-fail'), 5, 'warning'))
			.finally(() => reloadPage());
	}

	function handleDelete(notification: Notification) {
		API.REQUEST.delete(`notification/${notification.id}`) //
			.then(() => addPopup(i18n.t('delete-success'), 5, 'info'))
			.then(() => setUnreadNotifications((prev) => prev - 1))
			.catch(() => addPopup(i18n.t('delete-fail'), 5, 'warning'))
			.finally(() => reloadPage());
	}

	if (isLoading) return <LoadingSpinner />;

	if (pages.length === 0)
		return (
			<div className='flex-center'>
				<Trans i18nKey='no-notification' />
			</div>
		);

	return (
		<main className='h100p w100p scroll-y flex-column small-padding small-gap'>
			{pages.map((notification) => (
				<section className='notification flex-row flex-wrap space-between medium-padding border-box' key={notification.id}>
					<section className='flex-column'>
						<h3>{notification.header}</h3>
						<Markdown>{notification.message}</Markdown>
					</section>
					<section className='flex-row medium-gap align-self-end'>
						<Trans i18nKey='time' />: {new Date(notification.time).toLocaleString('en-GB')}
						<section className='flex-row small-gap center justify-start'>
							<IfTrue condition={notification.read === false} whenTrue={<IconButton icon='/assets/icons/check.png' onClick={() => handleMarkAsRead(notification)} />} />
							<IconButton icon='/assets/icons/trash-16.png' onClick={() => handleDelete(notification)} />
						</section>
					</section>
				</section>
			))}
		</main>
	);
}
