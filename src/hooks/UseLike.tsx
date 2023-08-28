import { useContext, useEffect, useRef, useState } from 'react';
import { API } from 'src/API';
import { LikeChange } from 'src/data/LikeChange';
import { Like } from 'src/data/Like';
import { MeContext } from 'src/context/MeProvider';
import { usePopup } from 'src/context/PopupMessageProvider';
import i18n from 'src/util/I18N';
import usePrivateAlert from 'src/hooks/UsePrivateAlert';

export default function useLike(contentType: string, targetId: string, initialLike: number = 0) {
	const [userLike, setUserLike] = useState<Like>({ userId: '', targetId: '', state: 0 });
	const [likes, setLikes] = useState<number>(initialLike);
	const [loading, setLoading] = useState(false);

	const PrivateAlert = usePrivateAlert();

	const { addPopup } = usePopup();

	const refUrl = useRef({ contentType, targetId });

	const meContext = useContext(MeContext);

	useEffect(() => {
		if (meContext.me && meContext.loading === false)
			API.getLikes(refUrl.current.contentType, refUrl.current.targetId) //
				.then((result) => setUserLike(result.data))
				.catch((error) => console.log(error));
	}, [meContext.me, meContext.loading]);

	function processLike(data: LikeChange) {
		if (data.amount === 0) {
			addPopup(i18n.t('like-fail'), 5, 'warning');
			return;
		}

		setUserLike(data.like);
		setLikes((prev) => prev + data.amount);
		if (data.amount === -1) addPopup(i18n.t('unlike-success'), 5, 'info');
		else addPopup(i18n.t('like-success'), 5, 'info');
	}

	function processDislike(data: LikeChange) {
		if (data.amount === 0) {
			addPopup(i18n.t('dislike-fail'), 5, 'warning');
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
				API.setLike(contentType, targetId) //
					.then((result) => processLike(result.data))
					.catch(() => addPopup(i18n.t('action-fail'), 5, 'warning'))
					.finally(() => setLoading(false));
			});
		},

		dislike: () => {
			if (loading === true) return;

			PrivateAlert(() => {
				setLoading(true);
				API.setDislike(contentType, targetId) //
					.then((result) => processDislike(result.data))
					.catch(() => addPopup(i18n.t('action-fail'), 5, 'warning'))
					.finally(() => setLoading(false));
			});
		},
	};
}
