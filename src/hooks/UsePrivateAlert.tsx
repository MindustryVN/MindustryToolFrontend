import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import usePopup from 'src/hooks/UsePopup';
import useMe from 'src/hooks/UseMe';

export default function usePrivateAlert() {
	const { addPopup } = usePopup();
	const { me } = useMe();

	const loginMessage = (
		<>
			<Trans i18nKey='login-before-start' />
			<Link className='small-padding' to='/login'>
				<Trans i18nKey='login' />
			</Link>
		</>
	);

	return (request: () => any) => {
		if (me) return request();
		else addPopup(loginMessage, 5, 'warning');
	};
}
