import React from 'react';
import { TagChoice } from './Tag';

interface TagPickProps {
	tag: TagChoice;
}

export default function TagPick({ tag }: TagPickProps) {
	return (
		<span className='flex flex-row flex-nowrap justify-start items-start text-start' style={{ color: tag.color }}>
			{tag.displayName} : {tag.displayValue}
		</span>
	);
}
