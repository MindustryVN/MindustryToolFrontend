import { API } from 'src/API';
import React, { useRef } from 'react';

import i18n from 'src/util/I18N';
import useInfinitePage from 'src/hooks/UseInfinitePage';
import useModel from 'src/hooks/UseModel';
import { usePopup } from 'src/context/PopupMessageProvider';
import ScrollToTopButton from 'src/components/ScrollToTopButton';
import { PostUploadInfo, PostUploadPreview } from 'src/routes/admin/verify/VerifyPostPage';
import InfiniteScroll from 'src/components/InfiniteScroll';
import Post from 'src/data/Post';

export default function MePostUploadTab() {
	const currentPost = useRef<Post>();

	const addPopup = usePopup();

	const { model, setVisibility } = useModel();
	const usePage = useInfinitePage<Post>(`user/post-upload`, 20);

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
		<main id='post-tab' className='flex h-full w-full flex-col gap-2 overflow-y-auto'>
			<InfiniteScroll
				className='grid grid-cols-[repeat(auto-fill,min(400px,100%))] gap-2'
				infinitePage={usePage}
				mapper={(v) => <PostUploadPreview key={v.id} post={v} handleOpenModel={handleOpenPostInfo} />}
			/>
			<footer className='flex items-center justify-center'>
				<ScrollToTopButton containerId='post-tab' />
			</footer>
			{currentPost.current &&
				model(
					<PostUploadInfo
						post={currentPost.current} //
						handleCloseModel={() => setVisibility(false)}
						handleRejectPost={rejectPost}
						handleVerifyPost={() => {}}
					/>,
				)}
		</main>
	);
}
