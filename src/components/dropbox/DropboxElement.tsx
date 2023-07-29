import './DropboxElement.css';

import React, { ReactNode } from 'react';

interface DropboxElementProps {
	children: ReactNode;
	onClick: () => void;
}

export default function DropboxElement(props: DropboxElementProps) {
	return (
		<button className='dropbox-element' title='' type='button' onClick={() => props.onClick()}>
			{props.children}
		</button>
	);
}
