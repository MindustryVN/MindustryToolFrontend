import React from 'react';
import UserRoleDisplay from 'src/components/UserRoleDisplay';
import User from 'src/data/User';

interface MeInfoTabProps {
	me: User;
}

export default function UserInfoTab({ me }: MeInfoTabProps) {
	return (
		<section className='flex flex-row justify-start items-start p-4 gap-2'>
			<img src={me.imageUrl} alt='user-avatar' />
			<section className='flex gap-2 items-end text-xl bg-slate-950 p-2 rounded-xl'>
				<span className='capitalize'>{me.name}</span>
				<UserRoleDisplay roles={me.role} />
			</section>
		</section>
	);
}
