import './MePage.css';
import 'src/styles.css';

import React from 'react';

import { Navigate } from 'react-router-dom';
import { Trans } from 'react-i18next';
import useMe from 'src/hooks/UseMe';
import Button from 'src/components/button/Button';

export default function MePage() {
	const { me, handleLogout } = useMe();

	if (!me) return <Navigate to='/login' />;

	return (
		<main className='flex-column h100p scroll-y'>
			<section className='user-card'>
				<section className='flex-row small-gap'>
					<img className='avatar-image' src={me.imageUrl} alt='avatar'></img>
					<span className='username capitalize'>{me.name}</span>
				</section>
				<Button className='button logout-button' onClick={() => handleLogout()}>
					<Trans i18nKey='logout' />
				</Button>
			</section>
		</main>
	);
}
