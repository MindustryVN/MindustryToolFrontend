import { UserRole } from 'src/data/UserRole';
import React, { ReactNode } from 'react';

interface UserRoleDisplayProps {
	roles: UserRole[];
}

export default function UserRoleDisplay({ roles }: UserRoleDisplayProps) {
	let arr: ReactNode[] = [];

	for (let i = 0; i < roles.length; i++) {
		arr.push(<Role key={i} role={roles[i]} />);
	}

	return <section className='flex gap-1'>{arr}</section>;
}

function Role({ role }: { role: UserRole }): ReactNode {
	switch (role) {
		case 'ADMIN':
			return <span className='text-green-500'>{role}</span>;

		default:
			return <></>;
	}
}
