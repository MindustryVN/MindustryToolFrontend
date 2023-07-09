import './UserName.css';

import { Link } from 'react-router-dom';
import UserData from './UserData';
import React from 'react';

interface UserNameProps {
	displayUser: UserData;
}

export function UserName(props: UserNameProps) {
	if (!props.displayUser) return <span>User not found</span>;

	if (props.displayUser.id === 'community') return <span>Community</span>;

	return (
		<Link className='user-name-card' to={`/user/${props.displayUser.id}`}>
			<img
				className='avatar'
				src={`${props.displayUser.imageUrl}?size=32`}
				onError={(event) =>
					// @ts-ignore
					(event.target.src = 'https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a69f118df70ad7828d4_icon_clyde_blurple_RGB.svg')
				}
				alt='avatar'/>
			{UserData.isAdmin(props.displayUser) && <span className='admin'>Admin</span>}
			<span className='capitalize'>{props.displayUser.name}</span>
		</Link>
	);
}

export default UserName;
