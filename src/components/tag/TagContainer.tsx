import React from 'react';
import Tag, { TagChoice } from 'src/components/tag/Tag';

interface TagContainerProps {
	className?: string;
	tags: TagChoice[];
}

export default function TagContainer(props: TagContainerProps) {
	if (!props.tags) return <></>;

	return (
		<section className={`flex flex-row flex-wrap gap-2  ${props.className ? props.className : ''}`}>
			{props.tags.map((t: TagChoice, index: number) => (
				<Tag key={index} tag={t} />
			))}
		</section>
	);
}
