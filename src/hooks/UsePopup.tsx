import { useContext } from 'react';
import { PopupMessageContext } from 'src/context/PopupMessageProvider';

export default function usePopup() {
	const { addPopup } = useContext(PopupMessageContext);

	return {
		addPopup,
	};
}
