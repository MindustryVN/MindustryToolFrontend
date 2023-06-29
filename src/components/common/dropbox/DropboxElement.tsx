import './DropboxElement.css'

import React, { ReactNode } from 'react';

export default class DropboxElement extends React.Component<{ onClick: () => void; children: ReactNode }> {
	render() {
		return (
			<button
				className='dropbox-element'
				type='button'
				onClick={(e) => {
					e.stopPropagation();
					this.props.onClick();
				}}>
				{this.props.children}
			</button>
		);
	}
}
