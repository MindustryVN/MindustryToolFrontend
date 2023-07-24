import './LoadUserName.css';

import React, { useEffect, useState } from 'react';
import { API } from 'src/API';
import UserName from './UserName';
import User from '../../data/User';
import { Trans } from 'react-i18next';
import { Cache } from 'src/data/IHash';

interface LoadUserNameProps {
	userId: string;
}

class LoadingUserCache {
	static users: Cache<User> = new Cache();
}

export default function LoadUserName(props: LoadUserNameProps) {
	const [loading, setLoading] = useState(true);
	const [displayUser, setDisplayUser] = useState<User>();

	useEffect(() => {
		if (props.userId === 'community') setLoading(false);
		else {
			let d = LoadingUserCache.users.cache[props.userId];
			if (d) {
				setLoading(false);
				setDisplayUser(d);
			} else {
				API.REQUEST.get(`/user/${props.userId}`)
					.then((result) => {
						setDisplayUser(result.data);
						LoadingUserCache.users.cache[props.userId] = result.data;
					}) //
					.catch(() => console.log(`User not found: ${props.userId}`))
					.finally(() => setLoading(false));
			}
		}
	}, [props]);

	if (props.userId === 'community') return <span>Community</span>;
	if (loading) return <span>Loading...</span>;
	if (displayUser) return <UserName displayUser={displayUser} />;
	return (
		<span className='user-not-found'>
			<Trans i18nKey='user-not-found' />
		</span>
	);
}
