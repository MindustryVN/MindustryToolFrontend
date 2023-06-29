import React, { Component, ReactNode } from 'react';
import Loading from '../common/Loading';
import UserData from '../common/user/UserData';
import { Navigate } from 'react-router-dom';

export default class Admin extends Component<{ children: ReactNode; loading: boolean; user: UserData | undefined }> {
	render() {
		if (this.props.loading) return <Loading />;
		if (UserData.isAdmin(this.props.user)) return this.props.children;
		return <Navigate to='/login' />;
	}
}
