import React, { ReactNode } from 'react';
import { cn } from 'src/util/Utils';

interface ModelProps {
	className?: string;
	children: ReactNode;
}

export default function Model({ className, children }: ModelProps) {
	return <section className={cn('fixed overflow-hidden top-[3rem] left-0 z-model background-gradient w-screen h-[calc(100vh-3rem)]', className)}>{children}</section>;
}
