import React, { Component, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

export default class PrivateRoute extends Component<{ children: ReactNode; authenticated: boolean }> {
	render() {
		if (this.props.authenticated) return <div>{this.props.children}</div>;
		else return <Navigate to='/login' />;
	}
}
