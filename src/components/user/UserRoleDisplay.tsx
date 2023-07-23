import { UserRole } from 'src/data/UserRole';
import './UserRoleDisplay.css';

import React, { ReactNode } from 'react';

interface UserRoleProps {
	roles: UserRole[];
}

export default function UserRoleDisplay(props: UserRoleProps) {
	let arr: ReactNode[] = [];

	for (let i = 0; i < props.roles.length; i++) {
		arr.push(<span key={i}>{getRoleSpan(props.roles[i])}</span>);
	}

	return <>{arr}</>;
}

function getRoleSpan(role: UserRole): ReactNode {
	switch (role) {
		case 'ADMIN':
			return <span className='admin-role'>{role}</span>;

		case 'USER':
		default:
			return <></>;
	}
}
