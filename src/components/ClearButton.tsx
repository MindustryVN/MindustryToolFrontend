import React, { HTMLProps, ReactNode } from 'react';
import { cn } from 'src/util/Utils';

interface ClearButtonProps {
	className?: string;
	children: ReactNode;
	title: string;
	active?: boolean;
	onClick: () => void;
}

export default function ClearButton({ children, className, title, active, onClick, ...props }: ClearButtonProps & HTMLProps<HTMLButtonElement>) {
	return (
		<button
			{...props}
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
