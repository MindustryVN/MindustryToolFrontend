import React, { Component, ReactNode } from 'react';

export default class DropboxElement extends React.Component<{ onClick : () => void, children: ReactNode }> {

    render() {
		return (
			<div className='dropbox-element' onClick={() => this.props.onClick()}>
				{this.props.children}
			</div>
		);
	}
}
