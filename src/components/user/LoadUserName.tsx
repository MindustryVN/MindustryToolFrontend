import './LoadUserName.css';

import React, { useEffect, useState } from 'react';
import { API } from 'src/API';
import UserName from './UserName';
import User from '../../data/User';
import { Trans } from 'react-i18next';

interface LoadUserNameProps {
	userId: string;
}

export default function LoadUserName(props: LoadUserNameProps) {
	const [loading, setLoading] = useState(true);
	const [displayUser, setDisplayUser] = useState<User>();

	useEffect(() => {
		if (props.userId === 'community') setLoading(false);
		else
			API.REQUEST.get(`/user/${props.userId}`)
				.then((result) => setDisplayUser(result.data)) //
				.catch(() => console.log(`User not found: ${props.userId}`))
				.finally(() => setLoading(false));
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
