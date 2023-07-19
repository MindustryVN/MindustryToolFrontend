import usePopup from 'src/hooks/UsePopup';
import useUser from 'src/hooks/UseUser';

export default function usePrivateAlert() {
	const { addPopup } = usePopup();
	const { user } = useUser();

	return (request: () => void) => {
		if (user) request();
		else addPopup('message.need-login', 5, 'warning');
	};
}
