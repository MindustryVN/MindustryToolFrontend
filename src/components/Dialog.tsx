import React, { ReactNode } from 'react';
import { cn } from 'src/util/Utils';

interface DialogProps {
	children?: ReactNode;
	className?: string;
}

export default function Dialog({ className, children }: DialogProps) {
	return (
		<section className='fixed top-[3rem] left-0 z-model w-screen h-[calc(100vh-3rem)] flex justify-center items-center backdrop-brightness-[25%]'>
			<section className={cn(className)}>{children}</section>
		</section>
	);
}
