import { useContext, useEffect, useRef, useState } from 'react';
import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import { API } from 'src/API';
import { LikeChange } from 'src/data/LikeChange';
import { UserLike } from 'src/data/UserLike';
import { UserContext } from 'src/context/UserProvider';
import usePopup from 'src/hooks/UsePopup';
import i18n from 'src/util/I18N';
import usePrivateAlert from 'src/hooks/UsePrivateAlert';

const loginMessage = (
	<>
		<Trans i18nKey='login-before-like' />
		<Link className='small-padding' to='/login'>
			<Trans i18nKey='login' />
		</Link>
	</>
);

export default function useLike(url: string, initialLike: number = 0) {
	const [userLike, setUserLike] = useState<UserLike>({ userId: '', targetId: '', state: 0 });
	const [likes, setLikes] = useState<number>(initialLike);
	const [loading, setLoading] = useState(false);
	const PrivateAlert = usePrivateAlert();

	const { addPopup } = usePopup();

	const ref = useRef({ url: url, addPopup: addPopup });

	const userContext = useContext(UserContext);

	function isLoggedIn(): boolean {
		if (userContext.loading) {
			addPopup(i18n.t('logging-in'), 5, 'info');
			return false;
		}

		if (!userContext.user) {
			addPopup(loginMessage, 5, 'info');
			return false;
		}
		return true;
	}

	useEffect(() => {
		if (userContext.user && userContext.loading === false)
			API.REQUEST.get(`${ref.current.url}/liked`) //
				.then((result) => setUserLike(result.data))
				.catch(() => ref.current.addPopup(i18n.t('get-like-fail'), 5, 'warning'));
	}, [userContext]);

	function processLike(data: LikeChange) {
		if (data.amount === 0) {
			addPopup(i18n.t('action-fail'), 5, 'warning');
			return;
		}

		setUserLike(data.userLike);
		setLikes((prev) => prev + data.amount);
		if (data.amount === -1) addPopup(i18n.t('unlike-success'), 5, 'info');
		else addPopup(i18n.t('like-success'), 5, 'info');
	}

	function processDislike(data: LikeChange) {
		if (data.amount === 0) {
			addPopup(i18n.t('action-fail'), 5, 'warning');
			return;
		}
		setUserLike(data.userLike);
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
			if (!isLoggedIn()) return;

			setLoading(true);
			PrivateAlert(() =>
				API.REQUEST.get(`${url}/like`) //
					.then((result) => processLike(result.data))
					.catch(() => addPopup(i18n.t('action-fail'), 5, 'warning'))
					.finally(() => setLoading(false)),
			);
		},

		dislike: () => {
			if (loading === true) return;
			if (!isLoggedIn()) return;

			setLoading(true);
			PrivateAlert(() =>
				API.REQUEST.get(`${url}/dislike`) //
					.then((result) => processDislike(result.data))
					.catch(() => addPopup(i18n.t('action-fail'), 5, 'warning'))
					.finally(() => setLoading(false)),
			);
		},
	};
}
