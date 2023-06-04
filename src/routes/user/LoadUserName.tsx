import React, { Component } from 'react';
import { API } from '../../AxiosConfig';
import UserName from './UserName';

export default class LoadUserName extends Component<{ userId: string }, { loading: boolean; user: UserInfo | null }> {
	state: Readonly<{ loading: boolean; user: UserInfo | null }> = {
		loading: true,
		user: null
	};

	componentDidMount(): void {
		if (this.props.userId === 'community') this.setState({ loading: false });
		else
			API.get(`/users/${this.props.userId}`)
				.then((result) => this.setState({ user: result.data })) //
				.finally(() => this.setState({ loading: false }));
	}

	render() {
		if (this.props.userId === 'community') return <span>Community</span>;
		if (this.state.loading) return <span>Loading...</span>;
		if (this.state.user) return <UserName user={this.state.user} />;
		return <span>User not found</span>;
	}
}
