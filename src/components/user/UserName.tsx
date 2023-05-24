import React, { Component } from 'react';
import { API } from '../../AxiosConfig';

export default class UserName extends Component<{ userId: string }, { loading: boolean; username: string }> {
	state: Readonly<{ loading: boolean; username: string }> = {
		loading: true,
		username: ''
	};

	componentDidMount(): void {
		if (this.props.userId === 'community') this.setState({ loading: false });
		else
			API.get(`/users/${this.props.userId}`)
				.then((result) => this.setState({ username: result.data })) //
				.finally(() => this.setState({ loading: false }));
	}

	render() {
		return <span>{this.props.userId === 'community' ? <span>Community</span> : this.state.loading ? <span>Loading...</span> : this.state.username ? <a href={`/user/${this.props.userId}`}>{this.state.username}</a> : <span>User not found</span>}</span>;
	}
}
