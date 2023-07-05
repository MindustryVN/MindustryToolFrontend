import React, { ReactElement, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import Loading from '../loader/Loading';
import UserData from '../user/UserData';
import { UserContext } from '../provider/UserProvider';

interface PrivateRouteProps {
	element: ReactElement;
}

const PrivateRoute = (props: PrivateRouteProps) => {
	const { loading, user } = useContext(UserContext);

	if (loading) return <Loading />;

	if (UserData.isUser(user)) return props.element;

	return <Navigate to='/login' />;
};

export default PrivateRoute;
