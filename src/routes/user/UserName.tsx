import React, { Component } from 'react';
import { API } from '../../AxiosConfig';

export default class UserName extends Component<{ userId: string }, { loading: boolean; user: UserInfo | null }> {
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
		return <span>{this.props.userId === 'community' ? <span>Community</span> : this.state.loading ? <span>Loading...</span> : this.state.user ? <a href={`/user/${this.props.userId}`}>{this.state.user.name}</a> : <span>User not found</span>}</span>;
	}
}
