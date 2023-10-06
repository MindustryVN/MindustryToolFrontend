import { usePopup } from 'src/context/PopupMessageProvider';
import i18n from 'src/util/I18N';

export default function useClipboard() {
	const addPopup = usePopup();

	return {
		copy: (data: string) => {
			navigator.clipboard.writeText(data).then(() => addPopup(i18n.t('copied'), 5, 'info'));
		},
	};
}
