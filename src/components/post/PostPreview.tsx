import 'src/styles.css';

import React from 'react';
import LoadUserName from 'src/components/LoadUserName';
import TagContainer from 'src/components/tag/TagContainer';
import { Tags } from 'src/components/tag/Tag';
import DateDisplay from 'src/components/common/Date';

interface PropsPreviewProps {
	post: Post;
}

export default function PostPreview(props: PropsPreviewProps) {
	return (
		<section className='post-title flex-column big-padding medium-gap'>
			<span className='title'>{props.post.header}</span>
			<LoadUserName userId={props.post.authorId} />
			<TagContainer tags={Tags.parseArray(props.post.tags, Tags.POST_SEARCH_TAG)} />
			<DateDisplay className='align-self-end' time={props.post.time} />
		</section>
	);
}
