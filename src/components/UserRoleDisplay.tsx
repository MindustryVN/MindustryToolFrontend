import { UserRole } from 'src/data/UserRole';
import React, { ReactNode } from 'react';

interface UserRoleDisplayProps {
	roles: UserRole[];
}

export default function UserRoleDisplay({ roles }: UserRoleDisplayProps) {
	return (
		<section className='flex gap-1'>
			{roles.map((role, index) => (
				<Role key={index} role={role} />
			))}
		</section>
	);
}

function Role({ role }: { role: UserRole }): ReactNode {
	switch (role) {
		case 'ADMIN':
			return <span className='text-green-500'>{role}</span>;

		default:
			return null;
	}
}
