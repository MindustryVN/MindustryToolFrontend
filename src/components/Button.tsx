import React, { HTMLProps, ReactNode } from 'react';
import { cn } from 'src/util/Utils';

interface ButtonProps {
	className?: string;
	children: ReactNode;
	title: string;
	active?: boolean;
	onClick: () => void;
}

export default function Button({ className, children, title, active, onClick, ...props }: ButtonProps & HTMLProps<HTMLButtonElement>) {
	return (
		<button
			{...props}
			className={cn(`flex items-center justify-center rounded-md border-2 border-slate-500 hover:bg-blue-500`, className, {
				'bg-blue-500': active,
			})}
			title={title}
			onClick={() => onClick()}
			type='button'>
			{children}
		</button>
	);
}
