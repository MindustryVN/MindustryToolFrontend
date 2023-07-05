import './UserPage.css';

import React, { useContext } from 'react';

import { Navigate } from 'react-router-dom';
import { UserContext } from '../../components/provider/UserProvider';

export default function UserPage() {
	const { user, handleLogout } = useContext(UserContext);

	if (user)
		return (
			<div className='flex-center'>
				<button className='button small-padding' type='button' onClick={() => handleLogout()}>
					Logout
				</button>
			</div>
		);

	return <Navigate to='/login' />;
}
