import React, { ReactNode } from 'react';

interface ModelProps {
	className?: string;
	children: ReactNode;
}

export default function Model(props: ModelProps) {
	return <section className={`fixed overflow-hidden top-[3rem] left-0 z-model background-gradient w-screen h-[calc(100vh-3rem)] ${props.className ? props.className : ''}`}>{props.children}</section>;
}
