import React, { ReactElement, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import Loading from 'src/components/loader/Loading';
import UserData from 'src/components/user/UserData';
import { UserContext } from 'src/components/provider/UserProvider';

interface PrivateRouteProps {
	element: ReactElement;
}

const PrivateRoute = (props: PrivateRouteProps) => {
	const { loading, user } = useContext(UserContext);

	if (loading) return <Loading />;

	if (UserData.isUser(user)) return props.element;

	return <Navigate to="/login" />;
};

export default PrivateRoute;
