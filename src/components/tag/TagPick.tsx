import '../../styles.css';

import React from 'react';
import { Trans } from 'react-i18next';
import { TagChoice } from './Tag';

interface TagPickProps {
	tag: TagChoice;
}

export default function TagPick(props: TagPickProps) {
	return (
		<span className='flexbox-row'>
			<Trans i18nKey={`tag.category.${props.tag.name}`} />: <Trans i18nKey={`tag.value.${props.tag.value}`} />
		</span>
	);
}
