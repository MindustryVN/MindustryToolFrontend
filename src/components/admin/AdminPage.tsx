import React from 'react';
import '../../styles.css';

const Admin = ({ user }: { user: UserInfo | undefined }) => {
	return <div className='flexbox-center'>{user ? user.name : 'Admin'}</div>;
};

export default Admin;
