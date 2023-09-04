import React from 'react';
import { IconType } from 'src/data/Icons';

interface ClearIconButtonProps {
	className?: string;
	icon: IconType;
	title: string;
	onClick: () => void;
}

export default function ClearIconButton(props: ClearIconButtonProps) {
	return (
		<button
			className={`flex justify-center items-center h-8 w-8 ${props.className ? props.className : ''}`} //
			type='button'
			title={props.title}
			onClick={() => props.onClick()}>
			<img className='h-4 w-4' src={props.icon} alt={props.title} />
		</button>
	);
}
