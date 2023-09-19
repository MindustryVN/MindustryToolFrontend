import React from 'react';

import IfTrue from 'src/components/IfTrue';
import useInfinitePage from 'src/hooks/UseInfinitePage';
import User from 'src/data/User';
import LoadingSpinner from 'src/components/LoadingSpinner';
import ScrollToTopButton from 'src/components/ScrollToTopButton';
import useInfiniteScroll from 'src/hooks/UseInfiniteScroll';
import { PostPreview } from 'src/routes/post/PostPage';

interface UserPostTabProps {
	user: User;
}

export default function UserPostTab({ user }: UserPostTabProps) {
	const usePage = useInfinitePage<Post>(`user/${user.id}/post`, 20);
	const { pages, isLoading } = useInfiniteScroll(usePage, (v) => <PostPreview key={v.id} post={v} />);

	return (
		<main id='post-tab' className='flex flex-col gap-2 w-full h-full overflow-y-auto'>
			<section children={pages} />
			<footer className='flex justify-center items-center'>
				<IfTrue
					condition={isLoading}
					whenTrue={<LoadingSpinner />} //
				/>
				<ScrollToTopButton containerId='post-tab' />
			</footer>
		</main>
	);
}
