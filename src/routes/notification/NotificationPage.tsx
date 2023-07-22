import './NotificationPage.css';
import 'src/styles.css';

import { Trans } from 'react-i18next';

import React from 'react';
import usePage from 'src/hooks/UsePage';
import Notification from 'src/data/Notification';
import useUser from 'src/hooks/UseUser';
import LoadingSpinner from 'src/components/loader/LoadingSpinner';
import IconButton from 'src/components/button/IconButton';
import { API } from 'src/API';
import usePopup from 'src/hooks/UsePopup';
import i18n from 'src/util/I18N';
import IfTrue from 'src/components/common/IfTrue';
import Markdown from 'src/components/markdown/Markdown';

export default function NotificationTab() {
	const { pages, isLoading, reloadPage } = usePage<Notification>('notification/page');
	const { user, loading } = useUser();

	const { addPopup } = usePopup();

	function handleMarkAsRead(notification: Notification) {
		API.REQUEST.put(`notification/${notification.id}`) //
			.then(() => {
				addPopup(i18n.t('mark-as-read'), 5, 'info');
				notification.isRead = true;
			})
			.catch(() => addPopup(i18n.t('action-fail'), 5, 'info'))
			.finally(() => reloadPage());
	}

	function handleDelete(notification: Notification) {
		API.REQUEST.delete(`notification/${notification.id}`) //
			.then(() => addPopup(i18n.t('delete-success'), 5, 'info'))
			.catch(() => addPopup(i18n.t('delete-fail'), 5, 'info'))
			.finally(() => reloadPage());
	}

	if (loading || isLoading) return <LoadingSpinner />;

	if (!user) return <Trans i18nKey='need-login' />;

	if (pages.length === 0)
		return (
			<div className='flex-center'>
				<Trans i18nKey='no-notification' />
			</div>
		);

	return (
		<main className='h100p w100p scroll-y flex-column small-padding small-gap'>
			{pages.map((notification) => (
				<section className='notification flex-row space-between medium-padding border-box' key={notification.id}>
					<Markdown>{notification.message}</Markdown>
					<p>
						<Trans i18nKey='date' />: {new Date(notification.time).toLocaleString('en-GB')}
					</p>
					<section className='flex-column small-gap center start'>
						<IfTrue condition={notification.isRead === false} whenTrue={<IconButton icon='/assets/icons/check.png' onClick={() => handleMarkAsRead(notification)} />} />
						<IconButton icon='/assets/icons/trash-16.png' onClick={() => handleDelete(notification)} />
					</section>
				</section>
			))}
		</main>
	);
}
