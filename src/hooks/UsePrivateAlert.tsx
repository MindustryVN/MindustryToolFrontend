import usePopup from 'src/hooks/UsePopup';
import useUser from 'src/hooks/UseUser';

export default function usePrivateAlert() {
	const { addPopup } = usePopup();
	const { user } = useUser();

	return (request: () => any) => {
		if (user) return request();
		else addPopup('need-login', 5, 'warning');
	};
}
