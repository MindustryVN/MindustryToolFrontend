import './MePage.css';
import 'src/styles.css';

import React, { useState } from 'react';

import { Navigate } from 'react-router-dom';
import { Trans } from 'react-i18next';
import { useMe } from 'src/context/MeProvider';
import Button from 'src/components/button/Button';
import UserSchematicUploadTab from 'src/routes/me/MeSchematicUploadTab';
import UserMapUploadTab from 'src/routes/me/MeMapUploadTab';
import UserPostUploadTab from 'src/routes/me/MePostUploadTab';

const tabs = ['Schematic', 'Map', 'Post'];

export default function MePage() {
	const { me, handleLogout } = useMe();
	const [currentTab, setCurrentTab] = useState<string>(tabs[0]);

	if (!me) return <Navigate to='/login' />;

	function renderTab(currentTab: string) {
		switch (currentTab) {
			case tabs[0]:
				return <UserSchematicUploadTab />;

			case tabs[1]:
				return <UserMapUploadTab />;

			case tabs[2]:
				return <UserPostUploadTab />;

			default:
				return <>Oh no</>;
		}
	}

	return (
		<main className='flex-column h100p w100p scroll-y medium-padding border-box'>
			<section className='flex-column small-gap align-start'>
				<section className='flex-row small-gap'>
					<img className='avatar-image' src={me.imageUrl} alt='avatar'></img>
					<span className='username capitalize'>{me.name}</span>
				</section>
				<Button className='button' onClick={() => handleLogout()}>
					<Trans i18nKey='logout' />
				</Button>
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
