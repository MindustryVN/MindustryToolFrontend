import React from 'react';
import UserAvatar from 'src/components/UserAvatar';
import UserRoleDisplay from 'src/components/UserRoleDisplay';
import User from 'src/data/User';

interface UserInfoTabProps {
	user: User;
}

export default function UserInfoTab({ user }: UserInfoTabProps) {
	return (
		<section className='flex flex-row items-start justify-start gap-2 p-4'>
			<UserAvatar className='h-32 w-32 rounded-xl text-4xl' user={user} />
			<section className='flex items-end gap-2 rounded-xl bg-slate-950 p-2 text-xl'>
				<span className='capitalize'>{user.name}</span>
				<UserRoleDisplay roles={user.role} />
			</section>
		</section>
	);
}
