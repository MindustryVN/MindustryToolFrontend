import './UserName.css';

import { Link } from 'react-router-dom';
import User from '../../data/User';
import React from 'react';
import UserRoleDisplay from 'src/components/user/UserRoleDisplay';

interface UserNameProps {
	displayUser: User;
}

export function UserName(props: UserNameProps) {
	return (
		<Link className='user-name-card' to={`/user/${props.displayUser.id}`}>
			<img
				className='avatar'
				src={`${props.displayUser.imageUrl}?size=32`}
				onError={(event) =>
					// @ts-ignore
					(event.target.src = 'https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a69f118df70ad7828d4_icon_clyde_blurple_RGB.svg')
				}
				alt='avatar'
			/>
			<UserRoleDisplay roles={props.displayUser.role} />
			<span className='capitalize'>{props.displayUser.name}</span>
		</Link>
	);
}

export default UserName;
