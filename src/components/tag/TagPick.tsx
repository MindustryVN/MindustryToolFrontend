import '../../styles.css';

import React from 'react';
import { TagChoiceLocal } from './Tag';

interface TagPickProps {
	tag: TagChoiceLocal;
}

export default function TagPick(props: TagPickProps) {
	return (
		<span className="flex-row">
			{props.tag.displayName} : {props.tag.displayValue}
		</span>
	);
}
