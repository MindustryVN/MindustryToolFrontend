import 'src/styles.css';

import React from 'react';
import Markdown from 'src/components/markdown/Markdown';
import TagContainer from 'src/components/tag/TagContainer';
import { Tags } from 'src/components/tag/Tag';
import LoadUserName from 'src/components/user/LoadUserName';
import DateDisplay from 'src/components/common/Date';

interface PostViewProps {
	post: Post;
}

export default function PostView(props: PostViewProps) {
	return (
		<section className='massive-padding border-box'>
			<header className='post-title flex-column massive-padding medium-gap'>
				<span className='title'>{props.post.header}</span>
				<LoadUserName userId={props.post.authorId} />
				<TagContainer tags={Tags.parseArray(props.post.tags, Tags.POST_SEARCH_TAG)} />
			</header>
			<Markdown children={props.post.content} />
			<footer className='flex-row justify-end'>
				<DateDisplay time={props.post.time} />
			</footer>
		</section>
	);
}
