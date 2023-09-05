import React from 'react';
import UserAvatar from 'src/components/UserAvatar';
import UserRoleDisplay from 'src/components/UserRoleDisplay';
import User from 'src/data/User';

interface UserInfoTabProps {
	user: User;
}

export default function UserInfoTab({ user }: UserInfoTabProps) {
	return (
		<section className='flex flex-row justify-start items-start p-4 gap-2'>
			<UserAvatar className='w-32 h-32 rounded-xl text-4xl' user={user} />
			<section className='flex gap-2 items-end text-xl bg-slate-950 p-2 rounded-xl'>
				<span className='capitalize'>{user.name}</span>
				<UserRoleDisplay roles={user.role} />
			</section>
		</section>
	);
}
