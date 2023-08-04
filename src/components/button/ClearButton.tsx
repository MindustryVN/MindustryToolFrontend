import 'src/styles.css';
import './ClearButton';

import React, { ReactNode } from 'react';

interface ButtonProps {
	className?: string;
	children: ReactNode;
	title?: string;
	onClick: () => void;
}

export default function ClearButton(props: ButtonProps) {
	return (
		<button className={`clear-button ${props.className ? props.className : ''} `} title={props.title ? props.title : 'button'} type='button' onClick={() => props.onClick()}>
			{props.children}
		</button>
	);
}
