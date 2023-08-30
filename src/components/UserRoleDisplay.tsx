import { UserRole } from 'src/data/UserRole';
import React, { ReactNode } from 'react';

interface UserRoleProps {
	roles: UserRole[];
}

export default function UserRoleDisplay(props: UserRoleProps) {
	let arr: ReactNode[] = [];

	for (let i = 0; i < props.roles.length; i++) {
		arr.push(<Role key={i} role={props.roles[i]} />);
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
