import React, { ReactElement, useContext } from 'react';
import Loading from 'src/components/loader/Loading';
import { Users } from 'src/components/user/UserData';
import { Navigate } from 'react-router-dom';
import { UserContext } from 'src/components/provider/UserProvider';

interface AdminRouteProps {
	element: ReactElement;
}

const AdminRoute = (props: AdminRouteProps) => {
	const { loading, user } = useContext(UserContext);

	if (loading) return <Loading />;

	if (Users.isAdmin(user)) return props.element;

	return <Navigate to='/login' />;
};

export default AdminRoute;
