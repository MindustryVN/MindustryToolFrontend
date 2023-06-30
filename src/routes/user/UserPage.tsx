import './UserPage.css';

import React from 'react';

import { useGlobalContext } from '../../App';
import UserName from './UserName';
import { Navigate } from 'react-router-dom';

const UserPage = () => {
	const { user } = useGlobalContext();

	if (user)
		return (
			<div className='flexbox-center'>
				<UserName displayUser={user} />
			</div>
		);

	return <Navigate to='/login' />;
};

export default UserPage;
