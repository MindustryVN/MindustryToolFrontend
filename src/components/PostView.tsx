import React from 'react';
import Markdown from 'src/components/Markdown';
import TagContainer from 'src/components/TagContainer';
import { Tags } from 'src/components/Tag';
import DateDisplay from 'src/components/Date';
import { useTags } from 'src/context/TagProvider';
import PostTitle from 'src/components/PostTitle';
import Author from 'src/components/Author';

interface PostViewProps {
	post: Post;
}

export default function PostView({ post }: PostViewProps) {
	const { postSearchTag } = useTags();

	return (
		<section className='box-border flex flex-col gap-2 p-4'>
			<header className='flex flex-col gap-2'>
				<PostTitle title={post.header} />
				<Author authorId={post.authorId} />
				<TagContainer tags={Tags.parseArray(post.tags, postSearchTag)} />
			</header>
			<Markdown children={post.content} />
			<footer className='flex flex-row justify-end'>
				<DateDisplay time={post.time} />
			</footer>
		</section>
	);
}
