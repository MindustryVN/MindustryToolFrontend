import 'src/styles.css';
import './UserDisplay.css';

import React, { useContext } from 'react';
import UserName from './UserName';
import { useNavigate } from 'react-router-dom';
import { UserContext } from 'src/components/provider/UserProvider';
import { Trans } from 'react-i18next';
import Button from 'src/components/button/Button';

export default function UserDisplay() {
	const { user } = useContext(UserContext);

	const navigate = useNavigate();

	function buildUserDisplay() {
		if (user) return <UserName displayUser={user} />;

		return (
			<Button className="user-display button" title="Login" onClick={() => navigate('/login')}>
				<Trans i18nKey="login" />
			</Button>
		);
	}

	return <div className="user-display">{buildUserDisplay()}</div>;
}
