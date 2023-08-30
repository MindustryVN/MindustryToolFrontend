import React, { ReactElement } from 'react';
import Loading from 'src/components/Loading';
import { Users } from 'src/data/User';
import { Navigate } from 'react-router-dom';
import { useMe } from 'src/context/MeProvider';
interface AdminRouteProps {
	element: ReactElement;
}

const AdminRoute = (props: AdminRouteProps) => {
	const { loading, me } = useMe();

	if (loading) return <Loading />;

	if (!me) return <Navigate to='/login' />;

	if (Users.isAdmin(me)) return props.element;
	return <Navigate to='/home' />;
};

export default AdminRoute;
