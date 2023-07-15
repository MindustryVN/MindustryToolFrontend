import { useContext, useEffect, useRef, useState } from 'react';
import { API } from 'src/API';
import { LikeChange } from 'src/components/like/LikeChange';
import { UserLike } from 'src/components/like/UserLike';
import { PopupMessageContext } from 'src/components/provider/PopupMessageProvider';
import i18n from 'src/util/I18N';

export default function useLike(url: string, initialLike: number = 0) {
	const [userLike, setUserLike] = useState<UserLike>({ userId: '', targetId: '', state: 0 });
	const [likes, setLikes] = useState<number>(initialLike);
	const [loading, setLoading] = useState(false);

	const { addPopupMessage } = useContext(PopupMessageContext);

	const ref = useRef({ url: url, addPopupMessage: addPopupMessage });

	useEffect(() => {
		API.REQUEST.get(`${ref.current.url}/liked`) //
			.then((result) => setUserLike(result.data))
			.catch(() => ref.current.addPopupMessage(i18n.t('get-like-fail'), 5, 'warning'));
	}, []);

	function processLike(data: LikeChange) {
		if (data.amount === 0) {
			addPopupMessage(i18n.t('action-fail'), 5, 'warning');
			return;
		}

		setUserLike(data.userLike);
		setLikes((prev) => prev + data.amount);
		if (data.amount === -1) addPopupMessage(i18n.t('unlike-success'), 5, 'info');
		else addPopupMessage(i18n.t('like-success'), 5, 'info');
	}

	function processDislike(data: LikeChange) {
		if (data.amount === 0) {
			addPopupMessage(i18n.t('action-fail'), 5, 'warning');
			return;
		}
		setUserLike(data.userLike);
		setLikes((prev) => prev + data.amount);
		if (data.amount === 1) addPopupMessage(i18n.t('un-dislike-success'), 5, 'info');
		else addPopupMessage(i18n.t('dislike-success'), 5, 'info');
	}

	return {
		likes: likes,
		loading: loading,
		userLike: userLike,

		liked: userLike.state === 1,
		disliked: userLike.state === -1,

		like: () => {
			if (loading === true) return;
			setLoading(true);
			API.REQUEST.get(`${url}/like`) //
				.then((result) => processLike(result.data))
				.catch(() => addPopupMessage(i18n.t('action-fail'), 5, 'warning'))
				.finally(() => setLoading(false));
		},

		dislike: () => {
			if (loading === true) return;
			setLoading(true);
			API.REQUEST.get(`${url}/dislike`) //
				.then((result) => processDislike(result.data))
				.catch(() => addPopupMessage(i18n.t('action-fail'), 5, 'warning'))
				.finally(() => setLoading(false));
		},
	};
}
