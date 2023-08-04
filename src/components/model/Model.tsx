import './Model.css';

import React, { ReactNode } from 'react';

interface ModelProps {
	className?: string;
	children: ReactNode;
}

export default function Model(props: ModelProps) {
	return <section className={`model background-image-1 ${props.className ? props.className : ''}`}>{props.children}</section>;
}
