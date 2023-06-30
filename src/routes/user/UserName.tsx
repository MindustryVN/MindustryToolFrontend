import UserData from '../../components/common/user/UserData';
import './UserName.css';

import React, { Component } from 'react';

export default class UserName extends Component<{ user: UserData }> {
	render() {
		if (this.props.user.id === 'community') return <span>Community</span>;

		return (
			<span className='user-name-card'>
				<img className='avatar' src={this.props.user.imageUrl} alt=''></img>
				<a className='name' href={`/user/${this.props.user.id}`}>
					{this.props.user.name}
				</a>
			</span>
		);
	}
}
