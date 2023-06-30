import React from 'react';
import { useGlobalContext } from '../../App';
import UserName from './UserName';
import { useNavigate } from 'react-router-dom';

import '../../styles.css';
import './UserDisplay.css';

const UserDisplay = () => {
	const { user } = useGlobalContext();

	const navigate = useNavigate();

	function buildUserDisplay() {
		if (user) return <UserName displayUser={user} />;
		else
			return (
				<button className='button small-padding' type='button' title='Login' onClick={() => navigate('/login')}>
					Login
				</button>
			);
	}

	return <div className='user-display'>{buildUserDisplay()}</div>;
};

export default UserDisplay;
