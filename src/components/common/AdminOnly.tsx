import React from 'react';
import { Users } from 'src/data/User';
import useMe from 'src/hooks/UseMe';

interface AdminOnlyProps {
	children?: React.ReactNode;
}

export default function AdminOnly(props: AdminOnlyProps) {
	const me = useMe();
	if (Users.isAdmin(me.me)) return props.children;
	return <></>;
}
