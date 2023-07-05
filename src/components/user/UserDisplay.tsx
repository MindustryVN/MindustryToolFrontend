import '../../styles.css';
import './UserDisplay.css';

import React, { useContext } from 'react';
import UserName from './UserName';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../provider/UserProvider';

export default function UserDisplay() {
	const { user } = useContext(UserContext);

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
}
