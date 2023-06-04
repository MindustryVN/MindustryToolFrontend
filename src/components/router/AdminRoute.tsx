import React, { Component, ReactNode } from 'react';
import Loading from '../common/Loading';

export default class Admin extends Component<{ children: ReactNode; loading: boolean; user: UserInfo | undefined }> {
	render() {
		if (this.props.loading) return <Loading/>;
		if (this.props.user && this.props.user.role.includes('ADMIN')) return this.props.children;
		return <></>;
	}
}
