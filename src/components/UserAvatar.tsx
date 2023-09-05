import React from 'react';
import User from 'src/data/User';
import { cn } from 'src/util/Utils';

interface UserAvatarProps {
	className?: string;
	user: User;
}
export default function UserAvatar({ className, user }: UserAvatarProps) {
	const [isError, setError] = React.useState(false);

	if (isError) {
		return <div className={cn('flex bg-slate-500 justify-center items-center capitalize', className)}>{user.name.at(0)}</div>;
	}

	return <img className={cn(className)} src={`${user.imageUrl}`} alt='loading' onError={() => setError(true)} />;
}
