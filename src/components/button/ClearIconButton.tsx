import 'src/styles.css';
import './ClearIconButton.css';

import React from 'react';
import { Icon } from 'src/components/common/Icon';

interface ClearIconButtonProps {
	className?: string;
	icon: Icon;
	title: string;
	onClick: () => void;
}

export default function ClearIconButton(props: ClearIconButtonProps) {
	return (
		<button className={`clear-icon-button flex-center ${props.className ? props.className : ''}`} title={props.title} type='button' onClick={() => props.onClick()}>
			<img src={props.icon} alt={props.title} />
		</button>
	);
}
