import React, { ReactNode } from 'react';

interface DialogProps {
	children?: ReactNode;
	className?: string;
}

export default function Dialog(props: DialogProps) {
	return (
		<section className='fixed top-[3rem] left-0 z-model w-screen h-[calc(100vh-3rem)] flex justify-center items-center backdrop-brightness-[25%]'>
			<section className={`${props.className ? props.className : ''}  `}>{props.children}</section>
		</section>
	);
}
