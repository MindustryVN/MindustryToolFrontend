import React, { Component, ReactNode } from 'react';

export default class Admin extends Component<{ children: ReactNode; user: UserInfo | undefined }> {
	render() {
		if (this.props.user && this.props.user.role.includes('ADMIN')) return <div>{this.props.children}</div>;
		return <></>;
	}
}
