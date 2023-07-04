import '../../../styles.css';
import './ClearIconButton.css';

import React from 'react';

interface ClearIconButtonParam {
	icon: string;
	title?: string;
	onClick: () => void;
}

export default function ClearIconButton(param: ClearIconButtonParam) {
	return (
		<button className='clear-icon-button flex-center small-padding' title={param.title} type='button' onClick={() => param.onClick()}>
			<img src={param.icon} alt={param.title} />
		</button>
	);
}
