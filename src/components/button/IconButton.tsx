import 'src/styles.css';

import React from 'react';
import { IconType } from 'src/data/Icons';
import Button from 'src/components/button/Button';

interface IconButtonProps {
	className?: string;
	active?: boolean;
	icon: IconType;
	title?: string;
	onClick: () => void;
}

export default function IconButton(props: IconButtonProps) {
	return (
		<Button className={props.className} active={props.active} title={props.title} onClick={() => props.onClick()}>
			<img src={props.icon} alt={props.title} />
		</Button>
	);
}
