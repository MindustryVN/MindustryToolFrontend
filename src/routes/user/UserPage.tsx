import UserData from '../../components/common/user/UserData';
import UserName from './UserName';
import './UserPage.css';

import React, { Component } from 'react';

export default class UserPage extends Component<{ user: UserData | undefined }> {
	render() {
		if (this.props.user)
			return (
				<div className='flexbox-center'>
					<UserName user={this.props.user} />
				</div>
			);
	}
}
