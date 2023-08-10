import 'src/styles.css';
import './UserPage.css';

import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API } from 'src/API';
import User from 'src/data/User';
import LoadingSpinner from 'src/components/loader/LoadingSpinner';
import { PopupMessageContext } from 'src/context/PopupMessageProvider';
import i18n from 'src/util/I18N';
import { Trans } from 'react-i18next';
import UserSchematicTab from './UserSchematicTab';
import UserMapTab from 'src/routes/user/UserMapTab';
import UserPostTab from 'src/routes/user/UserPostTab';
import Button from 'src/components/button/Button';

const tabs = ['Schematic', 'Map', 'Post'];

export default function UserPage() {
	const { userId } = useParams();

	const [loading, setLoading] = React.useState(true);

	const [user, setUser] = React.useState<User>();

	const popup = useRef(useContext(PopupMessageContext));

	const [currentTab, setCurrentTab] = useState<string>(tabs[0]);

	useEffect(() => {
		if (userId)
			API.getUser(userId) //
				.then((result) => setUser(result.data)) //
				.catch(() => popup.current.addPopup(i18n.t('user.load-fail'), 5, 'error'))
				.finally(() => setLoading(false));
	}, [userId]);

	function renderTab(currentTab: string) {
		if (!user) return <Trans i18nKey='user.not-found' />;

		switch (currentTab) {
			case tabs[0]:
				return <UserSchematicTab user={user} />;

			case tabs[1]:
				return <UserMapTab user={user} />;
			case tabs[2]:
				return <UserPostTab user={user} />;

			default:
				return <>Oh no</>;
		}
	}

	if (!userId)
		return (
			<main className='flex-center h100p w100p'>
				<Trans i18nKey='user.invalid-id' />
			</main>
		);

	if (loading)
		return (
			<main className='flex-center h100p w100p'>
				<LoadingSpinner />
			</main>
		);

	if (!user)
		return (
			<main className='flex-center h100p w100p'>
				<Trans i18nKey='user.not-found' />
			</main>
		);

	return (
		<main className='flex-column h100p w100p scroll-y medium-padding border-box'>
			<section className='user-card flex-row small-gap flex-nowrap'>
				<img className='avatar-image' src={user.imageUrl} alt='avatar'></img>
				<section className='info-card small-gap small-padding'>
					<span className='capitalize username'>{user.name}</span>
					<span className='flex-row small-gap'>
						{user.role.map((r, index) => (
							<span key={index} className='capitalize'>
								{r}
							</span>
						))}
					</span>
				</section>
			</section>
			<section className='flex-center'>
				<section className='grid-row small-gap small-padding'>
					{tabs.map((name, index) => (
						<Button
							className={currentTab === name ? 'button-active' : 'button'}
							key={index} //
							onClick={() => setCurrentTab(name)}>
							{name}
						</Button>
					))}
				</section>
			</section>
			{renderTab(currentTab)}
		</main>
	);
}
