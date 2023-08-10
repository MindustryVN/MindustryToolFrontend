import 'src/styles.css';

import React from 'react';
import { IconType } from 'src/data/Icons';

interface ClearIconButtonProps {
	className?: string;
	icon: IconType;
	title?: string;
	onClick: () => void;
}

export default function ClearIconButton(props: ClearIconButtonProps) {
	return (
		<button
			className={`clear-button flex-center ${props.className ? props.className : ''}`} //
			type='button'
			title={props.title ? props.title : 'button'}
			onClick={() => props.onClick()}>
			<img className={`${props.className ? props.className : ''}`} src={props.icon} alt={props.title} />
		</button>
	);
}
