import './MePage.css';
import 'src/styles.css';

import React, { useContext } from 'react';

import { Navigate } from 'react-router-dom';
import { UserContext } from 'src/components/provider/UserProvider';
import { Trans } from 'react-i18next';

export default function MePage() {
	const { user, handleLogout } = useContext(UserContext);

	if (!user) return <Navigate to='/login' />;

	return (
		<main className='flex-column h100p scroll-y'>
			<section className='user-card'>
				<section className='flex-row small-gap'>
					<img className='avatar-image' src={user.imageUrl} alt='avatar'></img>
					<span className='username capitalize'>{user.name}</span>
				</section>
				<button className='button logout-button' type='button' onClick={() => handleLogout()}>
					<Trans i18nKey='logout' />
				</button>
			</section>
		</main>
	);
}
