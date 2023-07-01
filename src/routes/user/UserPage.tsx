import './UserPage.css';

import React from 'react';

import { useGlobalContext } from '../../App';
import UserName from './UserName';
import { Navigate } from 'react-router-dom';

const UserPage = () => {
	const { user, handleLogout } = useGlobalContext();

	if (user)
		return (
			<div className='flexbox-center'>
				<button className='button small-padding' type='button' onClick={() => handleLogout()}>
					Logout
				</button>
			</div>
		);

	return <Navigate to='/login' />;
};

export default UserPage;
