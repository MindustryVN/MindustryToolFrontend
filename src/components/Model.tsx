import React, { ReactNode } from 'react';
import { cn } from 'src/util/Utils';

interface ModelProps {
	className?: string;
	children: ReactNode;
}

export default function Model({ className, children }: ModelProps) {
	return <section className={cn('background-gradient fixed left-0 right-0 bottom-0 top-[3rem] z-model overflow-auto', className)}>{children}</section>;
}
