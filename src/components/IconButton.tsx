import React from 'react';
import { IconType } from 'src/data/Icons';
import Button from 'src/components/Button';

interface IconButtonProps {
	className?: string;
	active?: boolean;
	icon: IconType;
	title: string;
	onClick: () => void;
}

export default function IconButton(props: IconButtonProps) {
	return (
		<Button className={props.className + ' h-8 w-8 flex justify-center items-center'} active={props.active} title={props.title} onClick={() => props.onClick()}>
			<img className='h-4 w-4' src={props.icon} alt={props.title} />
		</Button>
	);
}
