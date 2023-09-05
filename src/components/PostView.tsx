import React from 'react';
import Markdown from 'src/components/Markdown';
import TagContainer from 'src/components/TagContainer';
import { Tags } from 'src/components/Tag';
import LoadUserName from 'src/components/LoadUserName';
import DateDisplay from 'src/components/Date';
import { useTags } from 'src/context/TagProvider';
import PostTitle from 'src/components/PostTitle';

interface PostViewProps {
	post: Post;
}

export default function PostView({ post }: PostViewProps) {
	const { postSearchTag } = useTags();

	return (
		<section className='p-8 box-border'>
			<header className='flex flex-row p-8 gap-2'>
				<PostTitle title={post.header} />
				<LoadUserName userId={post.authorId} />
				<TagContainer tags={Tags.parseArray(post.tags, postSearchTag)} />
			</header>
			<Markdown children={post.content} />
			<footer className='flex flex-row justify-end'>
				<DateDisplay time={post.time} />
			</footer>
		</section>
	);
}
