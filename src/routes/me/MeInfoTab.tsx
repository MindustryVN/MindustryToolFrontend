import React from 'react';
import UserAvatar from 'src/components/UserAvatar';
import UserRoleDisplay from 'src/components/UserRoleDisplay';
import User from 'src/data/User';

interface MeInfoTabProps {
	me: User;
}

export default function UserInfoTab({ me }: MeInfoTabProps) {
	return (
		<section className='flex flex-row justify-start items-start p-4 gap-2'>
			<UserAvatar className='w-32 h-32 rounded-xl text-4xl' user={me} />
			<section className='flex gap-2 items-end text-xl bg-slate-950 p-2 rounded-xl'>
				<span className='capitalize'>{me.name}</span>
				<UserRoleDisplay roles={me.role} />
			</section>
		</section>
	);
}
