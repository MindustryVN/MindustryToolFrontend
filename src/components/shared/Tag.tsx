import './Tag.css';

import { capitalize } from './Util';

import React from 'react';

export default class Tag extends React.Component<{ index: number; name: string; value: string; color: string; onRemove: (key: number) => void }> {
	render() {
		return (
			<div className='tag' style={{ backgroundColor: this.props.color }}>
				<div className='tag-text'>
					{capitalize(this.props.name)}: {capitalize(this.props.value)}
				</div>
				<div className='remove-tag-button' onClick={() => this.props.onRemove(this.props.index)}>
					<img src='/assets/icons/quit.png' alt='quit'></img>
				</div>
			</div>
		);
	}
}
