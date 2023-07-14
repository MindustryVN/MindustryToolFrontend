import 'src/styles.css';

import React from 'react';
import Tag, { TagChoiceLocal } from 'src/components/tag/Tag';
import ClearIconButton from 'src/components/button/ClearIconButton';

interface TagEditContainerProps {
	className?: string;
	tags: TagChoiceLocal[];
	onRemove: (index: number) => void;
}

export default function TagEditContainer(props: TagEditContainerProps) {
	if (!props.tags) return <></>;

	return (
		<section className={`flex-row flex-wrap small-gap ${props.className ? props.className : ''}`}>
			{props.tags.map((t: TagChoiceLocal, index: number) => (
				<Tag key={index} tag={t} removeButton={<ClearIconButton icon='/assets/icons/quit.png' title='remove' onClick={() => props.onRemove(index)} />} />
			))}
		</section>
	);
}
