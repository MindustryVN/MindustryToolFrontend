import './UserName.css';

import React, { Component } from 'react';

export default class UserName extends Component<{ user: UserInfo }> {
	render() {
		return (
			<span className='user-name-card'>
				<img className='user-avatar' src={this.props.user.imageUrl} alt='avatar' />
				<a className='name' href={`/user/${this.props.user.id}`}>
					{this.props.user.name}
				</a>
			</span>
		);
	}
}
