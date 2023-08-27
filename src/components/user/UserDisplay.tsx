import 'src/styles.css';
import './UserDisplay.css';

import React from 'react';
import UserName from './UserName';
import { useNavigate } from 'react-router-dom';
import { Trans } from 'react-i18next';
import Button from 'src/components/button/Button';
import { useMe } from 'src/context/MeProvider';

export default function UserDisplay() {
	const { me } = useMe();

	const navigate = useNavigate();

	function buildUserDisplay() {
		if (me) return <UserName displayUser={me} />;

		return (
			<Button className='user-display button' title='Login' onClick={() => navigate('/login')}>
				<Trans i18nKey='login' />
			</Button>
		);
	}

	return <div className='user-display'>{buildUserDisplay()}</div>;
}
