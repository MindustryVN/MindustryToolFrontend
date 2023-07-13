import i18n from 'src/util/I18N';

import { useContext } from 'react';
import { PopupMessageContext } from 'src/components/provider/PopupMessageProvider';

export default function useClipboard() {
	const { addPopupMessage } = useContext(PopupMessageContext);

	return {
		copy: (data: string) => {
			navigator.clipboard.writeText(data).then(() =>
				addPopupMessage({
					message: i18n.t('copied'),
					duration: 5,
					type: 'info',
				}),
			);
		},
	};
}
