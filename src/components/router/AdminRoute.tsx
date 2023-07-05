import React, { ReactElement } from 'react';
import Loading from '../loader/Loading';
import UserData from '../user/UserData';
import { Navigate } from 'react-router-dom';
import { useGlobalContext } from '../../App';

interface AdminRouteProps {
	element: ReactElement;
}

const AdminRoute = (props: AdminRouteProps) => {
	const { loading, user } = useGlobalContext();

	if (loading) return <Loading />;

	if (UserData.isAdmin(user)) return props.element;

	return <Navigate to='/login' />;
};

export default AdminRoute;
