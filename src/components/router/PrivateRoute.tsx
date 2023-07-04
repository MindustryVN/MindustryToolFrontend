import React, { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import Loading from '../common/loader/Loading';
import UserData from '../common/user/UserData';
import { useGlobalContext } from '../../App';

interface PrivateRouteParam {
	element: ReactElement;
}

const PrivateRoute = (param: PrivateRouteParam) => {
	const { loading, user } = useGlobalContext();

	if (loading) return <Loading />;

	if (UserData.isUser(user)) return param.element;
	
	return <Navigate to='/login' />;
};

export default PrivateRoute;
