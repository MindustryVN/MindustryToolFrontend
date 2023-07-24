import { useContext, useEffect, useRef, useState } from 'react';
import { API } from 'src/API';
import { LikeChange } from 'src/data/LikeChange';
import { Like } from 'src/data/Like';
import { UserContext } from 'src/context/UserProvider';
import usePopup from 'src/hooks/UsePopup';
import i18n from 'src/util/I18N';
import usePrivateAlert from 'src/hooks/UsePrivateAlert';
import { API_BASE_URL } from 'src/config/Config';

export default function useLike(url: string, initialLike: number = 0) {
	const [userLike, setUserLike] = useState<Like>({ userId: '', targetId: '', state: 0 });
	const [likes, setLikes] = useState<number>(initialLike);
	const [loading, setLoading] = useState(false);

	const PrivateAlert = usePrivateAlert();

	const { addPopup } = usePopup();

	const refUrl = useRef(url);
	const refAddPopup = useRef(addPopup);

	const userContext = useContext(UserContext);

	useEffect(() => {
		if (userContext.user && userContext.loading === false)
			API.REQUEST.get(`${API_BASE_URL}${refUrl.current}/liked`) //
				.then((result) => setUserLike(result.data))
				.catch(() => refAddPopup.current(i18n.t('get-like-fail'), 5, 'warning'));
	}, [userContext]);

	function processLike(data: LikeChange) {
		if (data.amount === 0) {
			addPopup(i18n.t('action-fail'), 5, 'warning');
			return;
		}

		setUserLike(data.like);
		setLikes((prev) => prev + data.amount);
		if (data.amount === -1) addPopup(i18n.t('unlike-success'), 5, 'info');
		else addPopup(i18n.t('like-success'), 5, 'info');
	}

	function processDislike(data: LikeChange) {
		if (data.amount === 0) {
			addPopup(i18n.t('action-fail'), 5, 'warning');
			return;
		}
		setUserLike(data.like);
		setLikes((prev) => prev + data.amount);
		if (data.amount === 1) addPopup(i18n.t('un-dislike-success'), 5, 'info');
		else addPopup(i18n.t('dislike-success'), 5, 'info');
	}

	return {
		likes: likes,
		loading: loading,
		userLike: userLike,

		liked: userLike.state === 1,
		disliked: userLike.state === -1,

		like: () => {
			if (loading === true) return;

			PrivateAlert(() => {
				setLoading(true);
				API.REQUEST.get(`${API_BASE_URL}${url}/like`) //
					.then((result) => processLike(result.data))
					.catch(() => addPopup(i18n.t('action-fail'), 5, 'warning'))
					.finally(() => setLoading(false));
			});
		},

		dislike: () => {
			if (loading === true) return;

			PrivateAlert(() => {
				setLoading(true);
				API.REQUEST.get(`${API_BASE_URL}${url}/dislike`) //
					.then((result) => processDislike(result.data))
					.catch(() => addPopup(i18n.t('action-fail'), 5, 'warning'))
					.finally(() => setLoading(false));
			});
		},
	};
}
