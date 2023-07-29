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

export const ArrowUpCircle = () => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			fill='none'
			viewBox='0 0 24 24'
			strokeWidth={1.5}
			stroke='currentColor'
			height='50px' //
			width='50px'>
			<path strokeLinecap='round' fill='black' stroke='white' strokeLinejoin='round' d='M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
		</svg>
	);
};
