import React from 'react';
import { IconType } from 'src/data/Icons';
import { cn } from 'src/util/Utils';

interface ClearIconButtonProps {
	className?: string;
	icon: IconType;
	title: string;
	onClick: () => void;
}

export default function ClearIconButton({ className, icon, title, onClick }: ClearIconButtonProps) {
	return (
		<button
			className={cn(`flex justify-center items-center`, className)} //
			type='button'
			title={title}
			onClick={() => onClick()}>
			<img className='h-4 w-4 flex self-center align-middle' src={icon} alt={title} />
		</button>
	);
}
