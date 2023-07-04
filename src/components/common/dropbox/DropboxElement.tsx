import './DropboxElement.css';

import React, { ReactNode } from 'react';

interface DropboxElementParam {
	children: ReactNode;
	onClick: () => void;
}

export default function DropboxElement(param: DropboxElementParam) {
	return (
		<button className='dropbox-element' type='button' onClick={(e) => param.onClick()}>
			{param.children}
		</button>
	);
}
