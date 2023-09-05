import { Link } from 'react-router-dom';
import User from '../data/User';
import React from 'react';
import UserRoleDisplay from 'src/components/UserRoleDisplay';

interface UserNameProps {
	user: User;
}

export function UserName({ user }: UserNameProps) {
	return (
		<Link className='flex flex-row gap-1 items-end pb-2 w-full' to={`/user/${user.id}`}>
			<img className='rounded-full w-6 h-6' src={`${user.imageUrl}?size=32`} alt='avatar' />
			<UserRoleDisplay roles={user.role} />
			<span className='capitalize'>{user.name}</span>
		</Link>
	);
}

export default UserName;
