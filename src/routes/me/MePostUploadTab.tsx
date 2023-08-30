import 'src/styles.css';

import { API } from 'src/API';
import React, { useRef } from 'react';

import i18n from 'src/util/I18N';
import IfTrue from 'src/components/common/IfTrue';
import useInfinitePage from 'src/hooks/UseInfinitePage';
import useModel from 'src/hooks/UseModel';
import { usePopup } from 'src/context/PopupMessageProvider';
import LoadingSpinner from 'src/components/LoadingSpinner';
import ScrollToTopButton from 'src/components/button/ScrollToTopButton';
import useInfiniteScroll from 'src/hooks/UseInfiniteScroll';
import { PostUploadInfo, PostUploadPreview } from 'src/routes/admin/verify/post/VerifyPostPage';

export default function UserPostUploadTab() {
	const currentPost = useRef<Post>();

	const { addPopup } = usePopup();

	const { model, setVisibility } = useModel();
	const usePage = useInfinitePage<Post>(`user/post-upload`, 20);
	const { pages, isLoading } = useInfiniteScroll(usePage, (v) => <PostUploadPreview key={v.id} post={v} handleOpenModel={handleOpenPostInfo} />);

	function rejectPost(post: Post, reason: string) {
		setVisibility(false);
		API.rejectPost(post, reason) //
			.then(() => addPopup(i18n.t('delete-success'), 5, 'info')) //
			.catch(() => addPopup(i18n.t('delete-fail'), 5, 'error'))
			.finally(() => usePage.filter((p) => p !== post));
	}

	function handleOpenPostInfo(post: Post) {
		currentPost.current = post;
		setVisibility(true);
	}

	return (
		<main id='post-tab' className='flex-column small-gap w100p h100p scroll-y'>
			<section children={pages} />
			<footer className='flex-center'>
				<IfTrue
					condition={isLoading}
					whenTrue={<LoadingSpinner />} //
				/>
				<ScrollToTopButton containerId='post-tab' />
			</footer>
			<IfTrue
				condition={currentPost}
				whenTrue={
					currentPost.current &&
					model(
						<PostUploadInfo
							post={currentPost.current} //
							handleCloseModel={() => setVisibility(false)}
							handleRejectPost={rejectPost}
							handleVerifyPost={() => {}}
						/>,
					)
				}
			/>
		</main>
	);
}
