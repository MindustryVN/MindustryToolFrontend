import React from 'react';
import TagContainer from 'src/components/TagContainer';
import { Tags } from 'src/components/Tag';
import DateDisplay from 'src/components/Date';
import { useTags } from 'src/context/TagProvider';
import PostCard from 'src/components/PostCard';
import PostTitle from 'src/components/PostTitle';
import Author from 'src/components/Author';

interface PostPreviewProps {
	post: Post;
}

export default function PostPreview({ post }: PostPreviewProps) {
	const { postSearchTag } = useTags();
	return (
		<PostCard>
			<div className='grid gap-2'>
				<PostTitle title={post.header} />
				<Author authorId={post.authorId} />
				<TagContainer tags={Tags.parseArray(post.tags, postSearchTag)} />
			</div>
			<DateDisplay className='self-end' time={post.time} />
		</PostCard>
	);
}
