import { useContext } from 'react';
import { PopupMessageContext } from 'src/components/provider/PopupMessageProvider';

export default function usePopup() {
	const { addPopup } = useContext(PopupMessageContext);

	return {
		addPopup,
	};
}
