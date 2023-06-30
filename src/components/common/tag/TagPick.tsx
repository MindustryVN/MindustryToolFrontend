import '../../../styles.css';

import React, { Component } from 'react';
import { Trans } from 'react-i18next';
import { TagChoice } from './Tag';

export default class TagPick extends Component<{ tag: TagChoice }> {
	render() {
		return (
			<span className='flexbox-row'>
				<Trans i18nKey={`tag.category.${this.props.tag.name}`} />: <Trans i18nKey={`tag.value.${this.props.tag.value}`} />
			</span>
		);
	}
}
