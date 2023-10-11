import { useState } from 'react';
import { API } from 'src/API';
import { LikeChange } from 'src/data/LikeChange';
import { Like } from 'src/data/Like';
import { usePopup } from 'src/context/PopupMessageProvider';
import i18n from 'src/util/I18N';
import usePrivateAlert from 'src/hooks/UsePrivateAlert';

export default function useLike(contentType: string, targetId: string, initialLike: number = 0, initialLikeState: Like | undefined) {
	const [userLike, setUserLike] = useState<Like>(initialLikeState ? initialLikeState : { userId: '', targetId: '', state: 0 });
	const [likes, setLikes] = useState<number>(initialLike);
	const [loading, setLoading] = useState(false);

	const PrivateAlert = usePrivateAlert();

	const addPopup = usePopup();

	function processLike(data: LikeChange) {
		if (data.amount === 0) {
			return;
		}

		setUserLike(data.like);
		setLikes((prev) => prev + data.amount);
	}

	function processDislike(data: LikeChange) {
		if (data.amount === 0) {
			return;
		}
		setUserLike(data.like);
		setLikes((prev) => prev + data.amount);
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
					.catch(() => addPopup(i18n.t('like-fail'), 5, 'warning'))
					.finally(() => setLoading(false));
			});
		},

		dislike: () => {
			if (loading === true) return;

			PrivateAlert(() => {
				setLoading(true);
				API.setDislike(contentType, targetId) //
					.then((result) => processDislike(result.data))
					.catch(() => addPopup(i18n.t('dislike-fail'), 5, 'warning'))
					.finally(() => setLoading(false));
			});
		},
	};
}
