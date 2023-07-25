import 'src/styles.css';

import React from 'react';

import { IconType } from 'src/data/Icons';

interface IconProps {
	className?: string;
	icon: IconType;
}

export default function Icon(props: IconProps) {
	return <img className={props.className} src={props.icon} alt='icon' />;
}

export const Ellipsis = () => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		fill='none'
		viewBox='0 0 24 24'
		strokeWidth={1.5}
		stroke='currentColor'
		height='24px' //
		width='24px'>
		<path strokeLinecap='round' strokeLinejoin='round' d='M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z' />
	</svg>
);
