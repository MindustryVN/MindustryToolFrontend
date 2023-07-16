import 'src/styles.css';
import './ClearIconButton.css';

import React from 'react';
import { IconType } from 'src/components/common/Icons';

interface ClearIconButtonProps {
	className?: string;
	icon: IconType;
	title?: string;
	onClick: () => void;
}

export default function ClearIconButton(props: ClearIconButtonProps) {
	return (
		<button className={`clear-icon-button flex-center ${props.className ? props.className : ''}`} title={props.title ? props.title : 'button'} type='button' onClick={() => props.onClick()}>
			<img src={props.icon} alt={props.title} />
		</button>
	);
}
