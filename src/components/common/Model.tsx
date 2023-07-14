import React, { ReactNode } from 'react';

interface ModelProps {
	className?: string;
	children: ReactNode;
}

export default function Model(props: ModelProps) {
	return <section className={`${props.className} model`}>{props.children}</section>;
}
