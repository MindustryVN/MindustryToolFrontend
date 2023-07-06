import '../../styles.css';
import './ClearIconButton.css';

import React from 'react';

interface ClearIconButtonProps {
	icon: string;
	title: string;
	onClick: () => void;
}

export default function ClearIconButton(props: ClearIconButtonProps) {
	return (
		<button className='clear-icon-button flex-center small-padding' title={props.title} type='button' onClick={() => props.onClick()}>
			<img src={props.icon} alt={props.title} />
		</button>
	);
}
