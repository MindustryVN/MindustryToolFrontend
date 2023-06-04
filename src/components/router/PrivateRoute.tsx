import React, { Component, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import Loading from '../common/Loading';

export default class PrivateRoute extends Component<{ children: ReactNode; loading: boolean; user: UserInfo | undefined }> {
	render() {
		if (this.props.loading) return <Loading />;

		if (this.props.user) return this.props.children;
		else return <Navigate to='/login' />;
	}
}
