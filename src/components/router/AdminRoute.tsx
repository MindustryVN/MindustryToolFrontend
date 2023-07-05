import React, { ReactElement, useContext } from 'react';
import Loading from '../loader/Loading';
import UserData from '../user/UserData';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../provider/UserProvider';

interface AdminRouteProps {
	element: ReactElement;
}

const AdminRoute = (props: AdminRouteProps) => {
	const { loading, user } = useContext(UserContext);

	if (loading) return <Loading />;

	if (UserData.isAdmin(user)) return props.element;

	return <Navigate to='/login' />;
};

export default AdminRoute;
