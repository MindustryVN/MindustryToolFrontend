import React from 'react';

import useInfinitePage from 'src/hooks/UseInfinitePage';
import User from 'src/data/User';
import ScrollToTopButton from 'src/components/ScrollToTopButton';
import { PostPreview } from 'src/routes/post/PostPage';
import InfiniteScroll from 'src/components/InfiniteScroll';
import Post from 'src/data/Post';

interface UserPostTabProps {
	user: User;
}

export default function UserPostTab({ user }: UserPostTabProps) {
	const usePage = useInfinitePage<Post>(`user/${user.id}/post`, 20);

	return (
		<main id='post-tab' className='flex h-full w-full flex-col gap-2 overflow-y-auto'>
			<InfiniteScroll className='grid grid-cols-[repeat(auto-fill,min(400px,100%))] gap-2' infinitePage={usePage} mapper={(v) => <PostPreview key={v.id} post={v} />}></InfiniteScroll>
			<footer className='flex items-center justify-center'>
				<ScrollToTopButton containerId='post-tab' />
			</footer>
		</main>
	);
}
