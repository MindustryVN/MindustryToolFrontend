import 'src/styles.css';

import React from 'react';
import Tag, { TagChoiceLocal } from 'src/components/tag/Tag';

interface TagContainerProps {
	className?: string;
	tags: TagChoiceLocal[];
}

export default function TagContainer(props: TagContainerProps) {
	if (!props.tags) return <></>;

	return (
		<section className={`flex-row flex-wrap small-gap  ${props.className ? props.className : ''}`}>
			{props.tags.map((t: TagChoiceLocal, index: number) => (
				<Tag key={index} tag={t} />
			))}
		</section>
	);
}
