import './NotificationPage.css';
import 'src/styles.css';

import { Trans } from 'react-i18next';

import React from 'react';
import usePage from 'src/hooks/UsePage';
import Notification from 'src/data/Notification';
import useUser from 'src/hooks/UseUser';
import LoadingSpinner from 'src/components/loader/LoadingSpinner';

export default function NotificationTab() {
	const { pages, isLoading } = usePage<Notification>('notification/page');
	const { user, loading } = useUser();

	if (loading || isLoading) return <LoadingSpinner />;

	if (!user) return <Trans i18nKey='need-login' />;

	if (pages.length === 0)
		return (
			<div className='flex-center'>
				<Trans i18nKey='no-notification' />
			</div>
		);

	return (
		<main className='h100p w100p scroll-y flex-column small-gap'>
			{pages.map((notification) => (
				<section className='notification medium-padding border-box' key={notification.id}>
					<p>{notification.message}</p>
					<p>
						<Trans i18nKey='date' /> : {notification.time}
					</p>
				</section>
			))}
		</main>
	);
}
