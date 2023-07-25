import { API } from 'src/API';
import 'src/styles.css';
import i18n from 'src/util/I18N';

import './Tag.css';

import React, { ReactElement } from 'react';

interface TagProps {
	tag: TagChoiceLocal;
	removeButton?: ReactElement;
}

export default function Tag(props: TagProps) {
	return (
		<span className='tag flex-row flex-nowrap small-padding center' style={{ backgroundColor: props.tag.color }}>
			<span className='flex-column text-center'>
				{props.tag.displayName} : {props.tag.displayValue}
			</span>
			{props.removeButton}
		</span>
	);
}

export interface CustomTag {
	name: string;
	value: Array<string>;
	color: string;
}

export class Tags {
	static SCHEMATIC_UPLOAD_TAG: TagChoiceLocal[] = [];
	static SCHEMATIC_SEARCH_TAG: TagChoiceLocal[] = [];

	static getTag(tag: string, result: TagChoiceLocal[]) {
		API.getTagByName(tag) //
			.then((r) => {
				result.length = 0;
				let customTagList: Array<CustomTag> = r.data;
				let temp = customTagList.map((customTag) =>
					customTag.value.map((v) => new TagChoiceLocal(customTag.name, i18n.t(`tag.${customTag.name}.name`), v, i18n.t(`tag.${customTag.name}.value.${v}`), customTag.color)),
				);
				temp.forEach((t) => t.forEach((m) => result.push(m)));
			}) //
			.catch(() => console.log(`Fail to load tag: ${tag}`));
	}

	static parse(value: string, source: Array<TagChoiceLocal>) {
		let str = value.split(':');
		if (str.length !== 2) return undefined;

		let r = source.find((t) => t.name === str[0] && t.value === str[1]);
		if (!r) return undefined;

		return r;
	}

	static parseArray(value: Array<string>, source: Array<TagChoiceLocal>) {
		let arr = [];
		for (let i in value) {
			var r = this.parse(value[i], source);
			if (r) arr.push(r);
		}
		return arr;
	}

	static toString(tags: Array<TagChoiceLocal>) {
		return `${tags.map((t) => `${t.name}:${t.value}`).join()}`;
	}
}

export class TagChoiceLocal {
	name: string;
	displayName: string;
	value: string;
	displayValue: string;
	color: string;

	constructor(name: string, displayName: string, value: string, displayValue: string, color: string) {
		this.name = name;
		this.displayName = displayName;
		this.value = value;
		this.displayValue = displayValue;
		this.color = color;
	}

	toDisplayString() {
		return `${this.displayName}:${this.displayValue}`;
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
	new SortChoice(i18n.t('tag.newest'), 'time:1'), //
	new SortChoice(i18n.t('tag.oldest'), 'time:-1'), //
	new SortChoice(i18n.t('tag.most-liked'), 'like:1'),
];
