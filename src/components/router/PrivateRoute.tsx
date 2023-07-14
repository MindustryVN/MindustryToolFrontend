import React, { ReactElement, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import Loading from 'src/components/loader/Loading';
import { UserContext } from 'src/components/provider/UserProvider';
import { Users } from 'src/components/user/UserData';

interface PrivateRouteProps {
	element: ReactElement;
}

const PrivateRoute = (props: PrivateRouteProps) => {
	const { loading, user } = useContext(UserContext);

	if (loading) return <Loading />;

	if (Users.isUser(user)) return props.element;

	return <Navigate to="/login" />;
};

export default PrivateRoute;
