import '../../../styles.css';

import React from 'react';
import { Trans } from 'react-i18next';
import { TagChoice } from './Tag';

interface TagPickParam {
	tag: TagChoice;
}

export default function TagPick(param: TagPickParam) {
	return (
		<span className='flexbox-row'>
			<Trans i18nKey={`tag.category.${param.tag.name}`} />: <Trans i18nKey={`tag.value.${param.tag.value}`} />
		</span>
	);
}
