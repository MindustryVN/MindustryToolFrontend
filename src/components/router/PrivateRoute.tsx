import React, { Component, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import Loading from '../common/Loading';
import UserInfo from '../../routes/user/UserInfo';

export default class PrivateRoute extends Component<{ children: ReactNode; loading: boolean; user: UserInfo | undefined }> {
	render() {
		if (this.props.loading) return <Loading />;

		if (UserInfo.isUser(this.props.user)) return this.props.children;
		return <Navigate to='/login' />;
	}
}
