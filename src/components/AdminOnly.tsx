import React from 'react';
import { Users } from 'src/data/User';
import { useMe } from 'src/context/MeProvider';
interface AdminOnlyProps {
	children: React.ReactNode;
}

export default function AdminOnly({ children }: AdminOnlyProps) {
	const me = useMe();
	if (Users.isAdmin(me.me)) return children;
	return <></>;
}
