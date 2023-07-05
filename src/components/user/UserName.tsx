import { Link } from 'react-router-dom';
import UserData from './UserData';
import './UserName.css';

import React, { useContext } from 'react';
import { UserContext } from '../provider/UserProvider';

export const UserName = ({ displayUser }: { displayUser: UserData }) => {
	if (!displayUser) return <span>User not found</span>;

	if (displayUser.id === 'community') return <span>Community</span>;

	const { user } = useContext(UserContext);

	function buildUserLink() {
		if (user && displayUser.id === user.id)
			return (
				<Link className='name' to={`/user`}>
					{displayUser.name}
				</Link>
			);
		else
			return (
				<Link className='name' to={`/user/${displayUser.id}`}>
					{displayUser.name}
				</Link>
			);
	}

	return (
		<span className='user-name-card'>
			<img
				className='avatar'
				src={displayUser.imageUrl}
				onError={(event) =>
					// @ts-ignore
					(event.target.src = 'https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a69f118df70ad7828d4_icon_clyde_blurple_RGB.svg')
				}
				alt=''></img>
			{UserData.isAdmin(displayUser) && <span className='admin'>Admin</span>}
			{buildUserLink()}
		</span>
	);
};

export default UserName;
