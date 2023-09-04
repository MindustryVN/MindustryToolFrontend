import React from 'react';
import { TagChoice } from './Tag';

interface TagPickProps {
	tag: TagChoice;
}

export default function TagPick(props: TagPickProps) {
	return (
		<span className='flex flex-row' style={{ color: props.tag.color }}>
			{props.tag.displayName} : {props.tag.displayValue}
		</span>
	);
}
