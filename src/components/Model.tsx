import React, { ReactNode } from 'react';
import { cn } from 'src/util/Utils';

interface ModelProps {
	className?: string;
	children: ReactNode;
}

export default function Model({ className, children }: ModelProps) {
	return <section className={cn('background-gradient fixed left-0 top-[3rem] z-model h-[calc(100vh-3rem)] w-screen overflow-hidden', className)}>{children}</section>;
}
