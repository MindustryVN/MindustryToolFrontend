import React, { Component, ReactNode } from 'react';
import Loading from '../common/Loading';
import UserInfo from '../../routes/user/UserInfo';
import { Navigate } from 'react-router-dom';

export default class Admin extends Component<{ children: ReactNode; loading: boolean; user: UserInfo | undefined }> {
	render() {
		if (this.props.loading) return <Loading />;
		if (UserInfo.isAdmin(this.props.user)) return this.props.children;
		return <Navigate to='/login' />;
	}
}
