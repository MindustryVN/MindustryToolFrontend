import '../../styles.css';

import React from 'react';

interface IconButtonProps {
	icon: string;
	title?: string;
	onClick: () => void;
}

export default function IconButton(props: IconButtonProps) {
	return (
		<button className="button flex-center small-padding" title={props.title} type="button" onClick={() => props.onClick()}>
			<img src={props.icon} alt={props.title} />
		</button>
	);
}
