import React, { ReactNode } from 'react';

interface ButtonProps {
	className?: string;
	children: ReactNode;
	title: string;
	onClick: () => void;
}

export default function ClearButton(props: ButtonProps) {
	return (
		<button className={`${props.className ? props.className : ''}`} title={props.title} type='button' onClick={() => props.onClick()}>
			{props.children}
		</button>
	);
}
