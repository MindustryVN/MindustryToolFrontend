import { API } from 'src/API';
import i18n from 'src/util/I18N';

import React, { ReactElement } from 'react';

interface TagProps {
	tag: TagChoice;
	children?: ReactElement;
}

export default function Tag({ tag, children }: TagProps) {
	return (
		<span className='flex flex-row flex-nowrap rounded-lg h-10 p-2 justify-start items-center text-start' style={{ backgroundColor: tag.color }}>
			<span className='flex flex-row text-center'>
				{tag.displayName} : {tag.displayValue}
			</span>
			{children}
		</span>
	);
}

export interface CustomTag {
	name: string;
	value: Array<string>;
	color: string;
}

export class TagChoice {
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
		return `${this.name}${Tags.TAG_SEPARATOR}${this.value}`;
	}
}

export class Tags {
	static TAG_SEPARATOR = '_';

	static SORT_TAG: TagChoice[] = [
		new TagChoice('time', i18n.t('tag.newest'), '1', `time${this.TAG_SEPARATOR}1`, 'green'), //
		new TagChoice('time', i18n.t('tag.oldest'), '-1', `time${this.TAG_SEPARATOR}1`, 'green'), //
		new TagChoice('like', i18n.t('tag.most-liked'), '1', `like${this.TAG_SEPARATOR}1`, 'green'),
	];

	static getTag(tag: string, callback: (data: TagChoice[]) => void) {
		API.getTagByName(tag) //
			.then((r) => {
				let result: TagChoice[] = [];
				let customTagList: Array<CustomTag> = r.data;
				let temp = customTagList.map((customTag) =>
					customTag.value.map((value) => new TagChoice(customTag.name, i18n.t(`tag.${customTag.name}.name`), value, i18n.t(`tag.${customTag.name}.value.${value}`), customTag.color)),
				);
				temp.forEach((t) => t.forEach((m) => result.push(m)));
				callback(result);
			}) //
			.catch(() => console.log(`Fail to load tag: ${tag}`));
	}

	static parse(value: string | null | undefined, source: Array<TagChoice>) {
		if (!value) return null;

		if (source && source.length > 0) {
			let str = value.split(this.TAG_SEPARATOR);
			if (str.length !== 2) return null;

			let r = source.find((t) => t.name === str[0] && t.value === str[1]);
			if (!r) return undefined;

			return r;
		}
		return this.getTagFromString(value);
	}

	static getTagFromString(str: string) {
		let arr = str.split(this.TAG_SEPARATOR);
		if (arr.length !== 2) return null;

		const name = arr[0];
		const value = arr[1];

		return new TagChoice(name, i18n.t(`tag.${name}.name`), value, i18n.t(`tag.${name}.value.${value}`), 'green');
	}

	static parseArray(value: Array<string>, source: Array<TagChoice>) {
		let arr = [];
		for (let i in value) {
			var r = this.parse(value[i], source);
			if (r) arr.push(r);
		}
		return arr;
	}

	static toString(tags: Array<TagChoice>) {
		return `${tags.map((t) => `${t.name}${this.TAG_SEPARATOR}${t.value}`).join()}`;
	}
	static toStringArray(tags: Array<TagChoice>) {
		return tags.map((tag) => tag.toString());
	}
}
