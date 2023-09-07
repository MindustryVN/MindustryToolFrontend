import React, { useEffect, useState } from 'react';
import { API } from 'src/API';
import User from '../data/User';
import { Trans } from 'react-i18next';
import { Cache } from 'src/data/IHash';
import UserName from 'src/components/UserName';

interface LoadUserNameProps {
	userId: string;
}

class LoadingUserCache {
	static users: Cache<User> = new Cache();
}

export default function LoadUserName({ userId }: LoadUserNameProps) {
	const [loading, setLoading] = useState(true);
	const [displayUser, setDisplayUser] = useState<User>();

	useEffect(() => {
		if (userId === 'community') setLoading(false);
		else {
			let d = LoadingUserCache.users.cache[userId];
			if (d) {
				setLoading(false);
				setDisplayUser(d);
			} else {
				API.getUser(userId)
					.then((result) => {
						setDisplayUser(result.data);
						LoadingUserCache.users.cache[userId] = result.data;
					}) //
					.catch(() => console.log(`User not found: ${userId}`))
					.finally(() => setLoading(false));
			}
		}
	}, [userId]);

	if (userId === 'community') return <span>Community</span>;
	if (loading) return <span>Loading...</span>;
	if (displayUser) return <UserName user={displayUser} />;
	return (
		<span className='text-red-500'>
			<Trans i18nKey='user-not-found' />
		</span>
	);
}
