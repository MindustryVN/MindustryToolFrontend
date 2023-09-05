import React from 'react';
import Tag, { TagChoice } from 'src/components/Tag';
import ClearIconButton from 'src/components/ClearIconButton';
import { cn } from 'src/util/Utils';

interface TagEditContainerProps {
	className?: string;
	tags: TagChoice[];
	onRemove: (index: number) => void;
}

export default function TagEditContainer({ className, tags, onRemove }: TagEditContainerProps) {
	if (!tags) return <></>;

	return (
		<section className={cn(`flex flex-row flex-wrap gap-2`, className)}>
			{tags.map((t: TagChoice, index: number) => (
				<Tag key={index} tag={t}>
					<ClearIconButton icon='/assets/icons/quit.png' title='remove' onClick={() => onRemove(index)} />
				</Tag>
			))}
		</section>
	);
}
