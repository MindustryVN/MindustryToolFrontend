import './TagRemoveButton.css';

import React, { Component } from 'react';

export default class TagRemoveButton extends Component<{ onClick: () => void }> {
	render() {
		return (
			<button className='tag-remove-button' title='Add' type='button' onClick={() => this.props.onClick()}>
				<img src='/assets/icons/quit.png' alt='submit' />
			</button>
		);
	}
}
