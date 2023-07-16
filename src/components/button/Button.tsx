import 'src/styles.css';

import React, { ReactNode } from 'react';

interface ButtonProps {
	className?: string;
	children: ReactNode;
	title?: string;
	active?: boolean;
	onClick: () => void;
}

export default function Button(props: ButtonProps) {
	return (
		<button
			className={`${props.active ? 'button-active' : 'button'} flex-center ${props.className ? props.className : ''} `}
			title={props.title ? props.title : 'button'}
			type='button'
			onClick={() => props.onClick()}>
			{props.children}
		</button>
	);
}
