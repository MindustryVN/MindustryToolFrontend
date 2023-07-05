import React, { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import Loading from '../loader/Loading';
import UserData from '../user/UserData';
import { useGlobalContext } from '../../App';

interface PrivateRouteProps {
	element: ReactElement;
}

const PrivateRoute = (props: PrivateRouteProps) => {
	const { loading, user } = useGlobalContext();

	if (loading) return <Loading />;

	if (UserData.isUser(user)) return props.element;

	return <Navigate to='/login' />;
};

export default PrivateRoute;
