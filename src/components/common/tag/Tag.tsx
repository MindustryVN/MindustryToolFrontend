import { API } from '../../../API';
import '../../../styles.css';

import './Tag.css';

import React, { ReactElement } from 'react';
import { Trans } from 'react-i18next';

export default class Tag extends React.Component<{ tag: TagChoice; removeButton?: ReactElement }> {
	render() {
		return (
			<div className='tag flexbox-row flex-nowrap small-padding center' style={{ backgroundColor: this.props.tag.color }}>
				<div className='flexbox-column text-center'>
					<Trans i18nKey={`tag.category.${this.props.tag.name}`} />: <Trans i18nKey={`tag.value.${this.props.tag.value}`} />
				</div>
				{this.props.removeButton}
			</div>
		);
	}

	static SCHEMATIC_SEARCH_TAG : TagChoice[] = [];

	static {
		API.REQUEST.get('tag/schematic-upload-tag') //
			.then((result) => {
				let customTagList: Array<CustomTag> = result.data;
				let temp = customTagList.map((customTag) => customTag.value.map((v) => new TagChoice(customTag.name, v, customTag.color)));

				temp.forEach((t) => t.forEach((r) => Tag.SCHEMATIC_SEARCH_TAG.push(r)));
				
			});
	}
}

export interface CustomTag {
	name: string;
	value: Array<string>;
	color: string;
}
export class TagChoice {
	name: string;
	value: string;
	color: string;

	constructor(name: string, value: string, color: string) {
		this.name = name;
		this.value = value;
		this.color = color;
	}

	static parse(value: string, source: Array<TagChoice>) {
		let str = value.split(':');
		if (str.length != 2) return undefined;

		let r = source.find((t) => t.name === str[0] && t.value === str[1]);
		if (!r) return undefined;

		return new TagChoice(r.name, str[1], r.color);
	}

	static parseArray(value: Array<string>, source: Array<TagChoice>) {
		let arr = [];
		for (let i in value) {
			var r = this.parse(value[i], source);
			if (r) arr.push(r);
		}
		return arr;
	}
}

export class SortChoice {
	name: string;
	value: string;

	constructor(name: string, value: string) {
		this.name = name;
		this.value = value;
	}
}
export const SCHEMATIC_SORT_CHOICE = [
	new SortChoice('newest', 'time:1'), //
	new SortChoice('most liked', 'like:1')
];
