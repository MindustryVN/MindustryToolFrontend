import React, { ReactNode } from 'react';
import { cn } from 'src/util/Utils';

interface ButtonProps {
	className?: string;
	children: ReactNode;
	title: string;
	active?: boolean;
	onClick: () => void;
}

export default function Button({ className, children, title, active, onClick }: ButtonProps) {
	return (
		<button
			className={cn(`border-slate-500 border-2 rounded-lg`, className, {
				'dark:bg-blue-500': active,
			})}
			title={title}
			type='button'
			onClick={() => onClick()}>
			{children}
		</button>
	);
}
