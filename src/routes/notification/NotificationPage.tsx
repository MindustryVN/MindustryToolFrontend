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
import Button from 'src/components/button/Button';

export default function NotificationPage() {
	return <PrivateRoute element={<NotificationContainer />} />;
}

function NotificationContainer() {
	const { pages, isLoading, reloadPage } = usePage<Notification>('notification', 20);

	const { setUnreadNotifications } = useNotification();

	const { addPopup } = usePopup();

	function handleMarkAsRead(notification: Notification) {
		API.markNotificationAsRead(notification.id) //
			.then(() => (notification.read = true))
			.then(() => setUnreadNotifications((prev) => prev - 1))
			.catch(() => addPopup(i18n.t('action-fail'), 5, 'warning'))
			.finally(() => reloadPage());
	}

	function handleMarkAsReadAll() {
		API.markAsReadNotificationAll() //
			.then(() => setUnreadNotifications((_) => 0))
			.catch(() => addPopup(i18n.t('action-fail'), 5, 'warning'))
			.finally(() => reloadPage());
	}

	function handleDelete(notification: Notification) {
		API.deleteNotification(notification.id)
			.then(() => setUnreadNotifications((prev) => prev - 1))
			.catch(() => addPopup(i18n.t('delete-fail'), 5, 'warning'))
			.finally(() => reloadPage());
	}
	function handleDeleteAll() {
		API.deleteNotificationAll()
			.then(() => setUnreadNotifications((_) => 0))
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
		<main className='h100p w100p scroll-y flex-column small-padding small-gap border-box'>
			<section className='flex-row justify-end'>
				<Button onClick={() => handleMarkAsReadAll()}>
					<Trans i18nKey='mark-as-read-all' />
				</Button>
				<Button onClick={() => handleDeleteAll()}>
					<Trans i18nKey='delete-all' />
				</Button>
			</section>
			{pages.map((notification) => (
				<section className='notification flex-row flex-wrap space-between medium-padding border-box' key={notification.id}>
					<section className='flex-column'>
						<h3>{notification.header}</h3>
						<Markdown>{notification.content}</Markdown>
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
