import React, { ReactNode } from 'react';

interface ButtonProps {
	className?: string;
	children: ReactNode;
	title: string;
	active?: boolean;
	onClick: () => void;
}

export default function Button(props: ButtonProps) {
	return (
		<button
			className={`${props.active ? 'dark:bg-blue-500' : ''} border-slate-500 border-2 rounded-lg px-2 py-1 ${props.className ? props.className : ''} `}
			title={props.title}
			type='button'
			onClick={() => props.onClick()}>
			{props.children}
		</button>
	);
}
