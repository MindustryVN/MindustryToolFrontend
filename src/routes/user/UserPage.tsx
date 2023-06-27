import UserInfo from './UserInfo';
import UserName from './UserName';
import './UserPage.css';

import React, { Component } from 'react';

export default class UserPage extends Component<{ user: UserInfo | undefined }> {
	render() {
		if (this.props.user)
			return (
				<div className='flexbox-center'>
					<UserName user={this.props.user} />
				</div>
			);
	}
}
