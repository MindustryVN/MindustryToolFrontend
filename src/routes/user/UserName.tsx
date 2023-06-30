import { useGlobalContext } from '../../App';
import UserData from '../../components/common/user/UserData';
import './UserName.css';

import React from 'react';

export const UserName = ({ displayUser }: { displayUser: UserData }) => {
	if (!displayUser) return <span>User not found</span>;

	if (displayUser.id === 'community') return <span>Community</span>;

	const { user } = useGlobalContext();

	function buildUserLink() {
		if (user && displayUser.id === user.id)
			return (
				<a className='name' href={`/user`}>
					{displayUser.name}
				</a>
			);
		else
			return (
				<a className='name' href={`/user/${displayUser.id}`}>
					{displayUser.name}
				</a>
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
			{buildUserLink()}
		</span>
	);
};

export default UserName;
