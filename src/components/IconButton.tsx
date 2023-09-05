import React from 'react';
import { IconType } from 'src/data/Icons';
import Button from 'src/components/Button';
import { cn } from 'src/util/Utils';

interface IconButtonProps {
	className?: string;
	active?: boolean;
	icon: IconType;
	title: string;
	onClick: () => void;
}

export default function IconButton({ className, active, icon, title, onClick }: IconButtonProps) {
	return (
		<Button className={cn('flex justify-center items-center', className)} active={active} title={title} onClick={() => onClick()}>
			<img src={icon} alt={title} />
		</Button>
	);
}
