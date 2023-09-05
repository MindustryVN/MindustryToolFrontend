import React, { ReactNode } from 'react';
import { cn } from 'src/util/Utils';

interface ClearButtonProps {
	className?: string;
	children: ReactNode;
	title: string;
	active?: boolean;
	onClick: () => void;
}

export default function ClearButton({ children, className, title, active, onClick }: ClearButtonProps) {
	return (
		<button
			className={cn(className, {
				'bg-blue-500': active,
			})}
			type='button'
			title={title}
			onClick={() => onClick()}>
			{children}
		</button>
	);
}
