import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import { usePopup } from 'src/context/PopupMessageProvider';
import { useMe } from 'src/context/MeProvider';

export default function usePrivateAlert() {
	const { addPopup } = usePopup();
	const { me } = useMe();

	const loginMessage = (
		<>
			<Trans i18nKey='login-before-start' />
			<Link className='p-2' to='/login'>
				<Trans i18nKey='login' />
			</Link>
		</>
	);

	return (request: () => any) => {
		if (me) return request();
		else addPopup(loginMessage, 5, 'warning');
	};
}
