import React from 'react';
import UserAvatar from 'src/components/UserAvatar';
import UserRoleDisplay from 'src/components/UserRoleDisplay';
import User from 'src/data/User';

interface MeInfoTabProps {
	me: User;
}

export default function UserInfoTab({ me }: MeInfoTabProps) {
	return (
		<section className='flex flex-row items-start justify-start gap-2 p-4'>
			<UserAvatar className='h-32 w-32 rounded-xl text-4xl' user={me} />
			<section className='flex items-end gap-2 rounded-xl bg-slate-950 p-2 text-xl'>
				<span className='capitalize'>{me.name}</span>
				<UserRoleDisplay roles={me.role} />
			</section>
		</section>
	);
}
