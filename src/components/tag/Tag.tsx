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

	toString() {
		return `${this.name}:${this.value}`;
	}
}

export class Tags {
	static SCHEMATIC_UPLOAD_TAG: TagChoiceLocal[] = [];
	static SCHEMATIC_SEARCH_TAG: TagChoiceLocal[] = [];

	static POST_UPLOAD_TAG: TagChoiceLocal[] = [];
	static POST_SEARCH_TAG: TagChoiceLocal[] = [];
	
	static MAP_UPLOAD_TAG: TagChoiceLocal[] = [];
	static MAP_SEARCH_TAG: TagChoiceLocal[] = [];

	static SORT_TAG: TagChoiceLocal[] = [
		new TagChoiceLocal('time', i18n.t('tag.newest'), '1', 'time:1', 'green'), //
		new TagChoiceLocal('time', i18n.t('tag.oldest'), '-1', 'time:1', 'green'), //
		new TagChoiceLocal('like', i18n.t('tag.most-liked'), '1', 'time:1', 'green'),
	];

	static getTag(tag: string, result: TagChoiceLocal[]) {
		API.getTagByName(tag) //
			.then((r) => {
				result.length = 0;
				let customTagList: Array<CustomTag> = r.data;
				let temp = customTagList.map((customTag) =>
					customTag.value.map((value) => new TagChoiceLocal(customTag.name, i18n.t(`tag.${customTag.name}.name`), value, i18n.t(`tag.${customTag.name}.value.${value}`), customTag.color)),
				);
				temp.forEach((t) => t.forEach((m) => result.push(m)));
			}) //
			.catch(() => console.log(`Fail to load tag: ${tag}`));
	}

	static parse(value: string | null | undefined, source: Array<TagChoiceLocal>) {
		if (!value) return null;

		if (source && source.length > 0) {
			let str = value.split(':');
			if (str.length !== 2) return null;

			let r = source.find((t) => t.name === str[0] && t.value === str[1]);
			if (!r) return undefined;

			return r;
		}
		return this.getTagFromString(value);
	}

	static getTagFromString(str: string) {
		let arr = str.split(':');
		if (arr.length !== 2) return null;

		const name = arr[0];
		const value = arr[1];

		return new TagChoiceLocal(name, i18n.t(`tag.${name}.name`), value, i18n.t(`tag.${name}.value.${value}`), 'green');
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
