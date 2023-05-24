import './Dropbox.css';

import React, { ReactNode } from 'react';
import DropboxElement from './DropboxElement';

export default class Dropbox extends React.Component<{ value: string; submitButton?: ReactNode; children?: ReactNode[] }, { showDropbox: boolean }> {
	constructor(props: any) {
		super(props);
		this.state = {
			showDropbox: false
		};
	}

	render() {
		return (
			<div className='dropbox'>
				<div className='dropbox-input'>
					<div className='dropbox-text' onClick={() => this.setState({ showDropbox: !this.state.showDropbox })}>
						{this.props.value}
					</div>
					{this.props.submitButton}
				</div>
				<div className='dropbox-popup'>{this.state.showDropbox && <div className={'dropbox-element-container'}>{this.props.children && this.props.children.map((node, index) => <DropboxElement key={index} onClick={() => this.setState({ showDropbox: false })} children={node}></DropboxElement>)}</div>}</div>
			</div>
		);
	}
}
