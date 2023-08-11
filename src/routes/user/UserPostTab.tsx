import 'src/styles.css';

import React from 'react';

import IfTrue from 'src/components/common/IfTrue';
import useInfinitePage from 'src/hooks/UseInfinitePage';
import User from 'src/data/User';
import LoadingSpinner from 'src/components/loader/LoadingSpinner';
import ScrollToTopButton from 'src/components/button/ScrollToTopButton';
import useInfiniteScroll from 'src/hooks/UseInfiniteScroll';
import PostPreview from 'src/components/post/PostPreview';

interface UserPostTabProps {
	user: User;
}

export default function UserPostTab(props: UserPostTabProps) {
	const usePage = useInfinitePage<Post>(`user/${props.user.id}/post`, 20);
	const { pages, isLoading } = useInfiniteScroll(usePage, (v) => <PostPreview key={v.id} post={v} />);

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
		</main>
	);
}
