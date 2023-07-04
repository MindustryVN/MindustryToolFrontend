import '../../../styles.css';

import React from 'react';

interface IconButtonParam {
	icon: string;
	title?: string;
	onClick: () => void;
}

export default function IconButton(param: IconButtonParam) {
	return (
		<button className='button flex-center small-padding' title={param.title} type='button' onClick={() => param.onClick()}>
			<img src={param.icon} alt={param.title} />
		</button>
	);
}
