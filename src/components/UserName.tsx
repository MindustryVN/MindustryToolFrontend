import { Link } from 'react-router-dom';
import User from '../data/User';
import React from 'react';
import UserRoleDisplay from 'src/components/UserRoleDisplay';

interface UserNameProps {
	displayUser: User;
}

export function UserName(props: UserNameProps) {
	return (
		<Link className='flex flex-row gap-1 items-end pb-2 w-full' to={`/user/${props.displayUser.id}`}>
			<img className='rounded-full w-6 h-6' src={`${props.displayUser.imageUrl}?size=32`} alt='avatar' />
			<UserRoleDisplay roles={props.displayUser.role} />
			<span className='capitalize'>{props.displayUser.name}</span>
		</Link>
	);
}

export default UserName;
