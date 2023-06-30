import React, { ReactElement } from 'react';
import Loading from '../common/loader/Loading';
import UserData from '../common/user/UserData';
import { Navigate } from 'react-router-dom';
import { useGlobalContext } from '../../App';

const AdminRoute = ({ element }: { element: ReactElement }) => {
	const { loading, user } = useGlobalContext();
	if (loading) return <Loading />;
	if (UserData.isAdmin(user)) return element;
	return <Navigate to='/login' />;
};

export default AdminRoute;
