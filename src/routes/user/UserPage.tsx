import './UserPage.css';
import '../../styles.css';

import React, { useContext } from 'react';

import { Navigate } from 'react-router-dom';
import { UserContext } from '../../components/provider/UserProvider';

export default function UserPage() {
	const { user, handleLogout } = useContext(UserContext);

	if (!user) return <Navigate to='/login' />;

	return (
		<main className='flex-center h100v'>
			<button className='button small-padding' type='button' onClick={() => handleLogout()}>
				Logout
			</button>
		</main>
	);
}
