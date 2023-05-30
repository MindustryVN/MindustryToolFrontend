import './UserPage.css';

import React, { Component } from 'react';

export default class UserPage extends Component<{ user: UserInfo | undefined }> {
	render() {
		if (this.props.user)
			return (
				<div className='user-info flexbox-center'>
					<div>Id: {this.props.user.id}</div>
					<div>Name: {this.props.user.name}</div>
					<img src={this.props.user.imageUrl} alt='Avatar'></img>
				</div>
			);
	}
}
