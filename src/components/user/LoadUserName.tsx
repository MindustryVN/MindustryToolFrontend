import React, { Component, useEffect, useState } from 'react';
import { API } from '../../API';
import UserName from './UserName';
import UserData from './UserData';

interface LoadUserNameProps {
	userId: string;
}

export default function LoadUserName(props: LoadUserNameProps) {
	const [loading, setLoading] = useState(true);
	const [displayUser, setDisplayUser] = useState<UserData>();

	function loadUser(): void {
		if (props.userId === 'community') setLoading(false);
		else
			API.REQUEST.get(`/user/${props.userId}`)
				.then((result) => setDisplayUser(result.data)) //
				.finally(() => setLoading(false));
	}

	useEffect(() => loadUser(), []);

	if (props.userId === 'community') return <span>Community</span>;
	if (loading) return <span>Loading...</span>;
	if (displayUser) return <UserName displayUser={displayUser} />;
	return <span>User not found</span>;
}
