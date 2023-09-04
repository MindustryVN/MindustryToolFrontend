import './NotificationPage.css';

import { Trans } from 'react-i18next';
import { API } from 'src/API';

import React from 'react';
import useInfinitePage from 'src/hooks/UseInfinitePage';
import Notification from 'src/data/Notification';
import LoadingSpinner from 'src/components/LoadingSpinner';
import IconButton from 'src/components/IconButton';
import { usePopup } from 'src/context/PopupMessageProvider';
import i18n from 'src/util/I18N';
import IfTrue from 'src/components/IfTrue';
import Markdown from 'src/components/markdown/Markdown';
import PrivateRoute from 'src/components/PrivateRoute';
import useNotification from 'src/hooks/UseNotification';
import Button from 'src/components/Button';
import DateDisplay from 'src/components/Date';

export default function NotificationPage() {
	return <PrivateRoute element={<NotificationContainer />} />;
}

function NotificationContainer() {
	const { pages, isLoading, reloadPage } = useInfinitePage<Notification>('notification', 20);

	const { setUnreadNotifications } = useNotification();

	const { addPopup } = usePopup();

	function handleMarkAsRead(notification: Notification) {
		API.markNotificationAsRead(notification.id) //
			.then(() => (notification.read = true))
			.then(() => setUnreadNotifications((prev) => (prev === 0 ? 0 : prev - 1)))
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
			.then(() => setUnreadNotifications((prev) => (prev === 0 ? 0 : prev - 1)))
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
			<div className='flex justify-center items-center'>
				<Trans i18nKey='no-notification' />
			</div>
		);

	return (
		<main className='h-full w-full overflow-y-auto flex flex-row p-2 gap-2 box-border'>
			<section className='flex flex-row justify-end'>
				<Button title={i18n.t('mark-as-read-all')} onClick={() => handleMarkAsReadAll()}>
					<Trans i18nKey='mark-as-read-all' />
				</Button>
				<Button title={i18n.t('delete-all')} onClick={() => handleDeleteAll()}>
					<Trans i18nKey='delete-all' />
				</Button>
			</section>
			{pages.map((notification) => (
				<section className='notification flex flex-row flex-wrap space-between medium-padding box-border' key={notification.id}>
					<section className='flex flex-row'>
						<h3>{notification.header}</h3>
						<Markdown>{notification.content}</Markdown>
					</section>
					<section className='flex flex-row gap-2 align-self-end'>
						<Trans i18nKey='time' />: <DateDisplay time={notification.time} />
						<section className='flex flex-row gap-2 center justify-start'>
							<IfTrue
								condition={notification.read === false}
								whenTrue={<IconButton title={i18n.t('mark-as-read')} icon='/assets/icons/check.png' onClick={() => handleMarkAsRead(notification)} />}
							/>
							<IconButton title={i18n.t('delete')} icon='/assets/icons/trash-16.png' onClick={() => handleDelete(notification)} />
						</section>
					</section>
				</section>
			))}
		</main>
	);
}
