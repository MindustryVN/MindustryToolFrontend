import './Tag.css';
import '../../styles.css';

import React, { ReactElement } from 'react';
import { Trans } from 'react-i18next';
import { API } from '../../API';

export default class Tag extends React.Component<{ index: number; tag: TagChoice; removeButton?: ReactElement }> {
	render() {
		return (
			<div className='tag' style={{ backgroundColor: this.props.tag.color }}>
				<span>
					<Trans i18nKey={this.props.tag.name} />: <Trans i18nKey={this.props.tag.value} />
				</span>
				<span className='remove-button flexbox-center'>{this.props.removeButton}</span>
			</div>
		);
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
