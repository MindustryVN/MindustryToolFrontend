import './Dropbox.css';

import React, { ChangeEventHandler, ReactNode } from 'react';
import DropboxElement from './DropboxElement';

export default class Dropbox extends React.Component<{ value: string; onChange?: ChangeEventHandler<HTMLInputElement>; submitButton?: ReactNode; children?: ReactNode[] }, { showDropbox: boolean }> {
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
					<input
						className='dropbox-text'
						type='text'
						value={this.props.value}
						onChange={(event) => {
							if (this.props.onChange) this.props.onChange(event);
							this.setState({ showDropbox: true });
						}}
						onClick={() => this.setState({ showDropbox: !this.state.showDropbox })}
					/>
					{this.props.submitButton}
				</div>
				<div className='dropbox-popup'>{this.state.showDropbox && <div className={'dropbox-element-container'}>{this.props.children ? this.props.children.map((node, index) => <DropboxElement key={index} onClick={() => this.setState({ showDropbox: false })} children={node} />) : <div>No result</div>}</div>}</div>
			</div>
		);
	}
}
