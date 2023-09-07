import React from 'react';
import Tag, { TagChoice } from 'src/components/Tag';
import { cn } from 'src/util/Utils';

interface TagContainerProps {
	className?: string;
	tags: TagChoice[];
}

export default function TagContainer({ className, tags }: TagContainerProps) {
	if (!tags) return <></>;

	return (
		<section className={cn(`flex flex-row flex-wrap gap-2`, className)}>
			{tags.map((t: TagChoice, index: number) => (
				<Tag key={index} tag={t} />
			))}
		</section>
	);
}
