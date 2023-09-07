import React from 'react';
import LoadUserName from 'src/components/LoadUserName';
import TagContainer from 'src/components/TagContainer';
import { Tags } from 'src/components/Tag';
import DateDisplay from 'src/components/Date';
import { useTags } from 'src/context/TagProvider';
import PostCard from 'src/components/PostCard';
import PostTitle from 'src/components/PostTitle';

interface PostPreviewProps {
	post: Post;
}

export default function PostPreview({ post }: PostPreviewProps) {
	const { postSearchTag } = useTags();
	return (
		<PostCard>
			<PostTitle title={post.header} />
			<LoadUserName userId={post.authorId} />
			<TagContainer tags={Tags.parseArray(post.tags, postSearchTag)} />
			<DateDisplay className='align-self-end' time={post.time} />
		</PostCard>
	);
}
