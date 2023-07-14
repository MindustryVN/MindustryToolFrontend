import Button from 'src/components/button/Button';
import './DropboxElement.css';

import React, { ReactNode } from 'react';

interface DropboxElementProps {
	children: ReactNode;
	onClick: () => void;
}

export default function DropboxElement(props: DropboxElementProps) {
	return (
		<Button className="dropbox-element" onClick={() => props.onClick()}>
			{props.children}
		</Button>
	);
}
