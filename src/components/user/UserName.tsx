import './UserName.css';

import { useNavigate } from 'react-router-dom';
import UserData from './UserData';
import React from 'react';

interface UserNameProps {
	displayUser: UserData;
}

export function UserName(props: UserNameProps) {
	if (!props.displayUser) return <span>User not found</span>;

	if (props.displayUser.id === 'community') return <span>Community</span>;

	const navigate = useNavigate();

	return (
		<button className='user-name-card' type='button' onClick={() => navigate(`/user/${props.displayUser.id}`)}>
			<img
				className='avatar'
				src={props.displayUser.imageUrl}
				onError={(event) =>
					// @ts-ignore
					(event.target.src = 'https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a69f118df70ad7828d4_icon_clyde_blurple_RGB.svg')
				}
				alt=''></img>
			{UserData.isAdmin(props.displayUser) && <span className='admin'>Admin</span>}
			<span className='capitalize'>{props.displayUser.name}</span>
		</button>
	);
}

export default UserName;
