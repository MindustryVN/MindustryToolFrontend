import React, { Component, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import Loading from '../common/Loading';
import UserData from '../common/user/UserData';

export default class PrivateRoute extends Component<{ children: ReactNode; loading: boolean; user: UserData | undefined }> {
	render() {
		if (this.props.loading) return <Loading />;

		if (UserData.isUser(this.props.user)) return this.props.children;
		return <Navigate to='/login' />;
	}
}
