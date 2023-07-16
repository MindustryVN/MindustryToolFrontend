import './Dialog.css';
import 'src/styles.css';

import React, { ReactNode } from 'react';

interface DialogProps {
	children?: ReactNode;
	className?: string;
}

export default function Dialog(props: DialogProps) {
	return (
		<section className='dialog fixed h100p w100p flex-center'>
			<section className={`dialog-card ${props.className ? props.className : ''}`}>{props.children}</section>
		</section>
	);
}
