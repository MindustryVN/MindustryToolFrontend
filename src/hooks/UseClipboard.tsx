import i18n from 'src/util/I18N';

import { useContext } from 'react';
import { PopupMessageContext } from 'src/components/provider/PopupMessageProvider';

export default function useClipboard() {
	const { addPopupMessage } = useContext(PopupMessageContext);

	return {
		copy: (data: string) => {
			navigator.clipboard.writeText(data).then(() => addPopupMessage(i18n.t('copied'), 5, 'info'));
		},
	};
}
