import React, { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import Loading from 'src/components/Loading';
import { Users } from 'src/data/User';
import { useMe } from 'src/context/MeProvider';
interface PrivateRouteProps {
	element: ReactElement;
}

function PrivateRoute({ element }: PrivateRouteProps) {
	const { loading, me } = useMe();

	if (loading) return <Loading />;

	if (Users.isUser(me)) return element;

	return <Navigate to='/login' />;
}

export default PrivateRoute;
