import './MePage.css';
import '../../styles.css';

import React, { useContext } from 'react';

import { Navigate } from 'react-router-dom';
import { UserContext } from '../../components/provider/UserProvider';
import { Trans } from 'react-i18next';

export default function MePage() {
	const { user, handleLogout } = useContext(UserContext);

	if (!user) return <Navigate to="/login" />;

	return (
		<main className="flex-center h100v">
			<section className="user-card">
				<img className="avatar-image" src={user.imageUrl} alt="avatar"></img>
				<span className="capitalize">{user.name}</span>
			</section>
			<button className="button logout-button" type="button" onClick={() => handleLogout()}>
				<Trans i18nKey="logout" />
			</button>
		</main>
	);
}
