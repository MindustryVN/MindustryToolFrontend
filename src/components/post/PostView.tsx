import React from 'react';
import Markdown from 'src/components/markdown/Markdown';
import TagContainer from 'src/components/tag/TagContainer';
import { Tags } from 'src/components/tag/Tag';
import LoadUserName from 'src/components/LoadUserName';
import DateDisplay from 'src/components/Date';

interface PostViewProps {
	post: Post;
}

export default function PostView(props: PostViewProps) {
	return (
		<section className='p-8 box-border'>
			<header className='post-title flex flex-row p-8 gap-2'>
				<span className='title'>{props.post.header}</span>
				<LoadUserName userId={props.post.authorId} />
				<TagContainer tags={Tags.parseArray(props.post.tags, Tags.POST_SEARCH_TAG)} />
			</header>
			<Markdown children={props.post.content} />
			<footer className='flex flex-row justify-end'>
				<DateDisplay time={props.post.time} />
			</footer>
		</section>
	);
}
