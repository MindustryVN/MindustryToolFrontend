import { useNavigate } from 'react-router-dom';
import UserData from './UserData';
import './UserName.css';

import React, { useContext } from 'react';
import { UserContext } from '../provider/UserProvider';

export const UserName = ({ displayUser }: { displayUser: UserData }) => {
	if (!displayUser) return <span>User not found</span>;

	if (displayUser.id === 'community') return <span>Community</span>;

	const { user } = useContext(UserContext);

	const navigate = useNavigate();

	function navigateToUserPage() {
		if (user && displayUser.id === user.id) navigate('/user');
		else navigate(`/user/${displayUser.id}`);
	}

	return (
		<button className='user-name-card' onClick={() => navigateToUserPage()}>
			<img
				className='avatar'
				src={displayUser.imageUrl}
				onError={(event) =>
					// @ts-ignore
					(event.target.src = 'https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a69f118df70ad7828d4_icon_clyde_blurple_RGB.svg')
				}
				alt=''></img>
			{UserData.isAdmin(displayUser) && <span className='admin'>Admin</span>}
			{displayUser.name}
		</button>
	);
};

export default UserName;
