import 'src/styles.css';

import React from 'react';
import { Icon } from 'src/components/common/Icon';

interface IconButtonProps {
	icon: Icon;
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
