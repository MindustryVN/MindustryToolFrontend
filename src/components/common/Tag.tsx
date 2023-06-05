import './Tag.css';
import '../../styles.css';

import { capitalize } from '../../util/StringUtils';

import React, { ReactElement } from 'react';

export default class Tag extends React.Component<{ index: number; name: string; value: string; color: string; removeButton?: ReactElement }> {
	render() {
		return (
			<div className='tag' style={{ backgroundColor: this.props.color }}>
				<span>
					{capitalize(this.props.name)}: {capitalize(this.props.value)}
				</span>
				<span className='remove-button flexbox-center'>{this.props.removeButton}</span>
			</div>
		);
	}
}

export class CustomTagChoice {
	category: string;
	value: string;
	color: string;

	constructor(category: string, value: string, color: string) {
		this.category = category;
		this.value = value;
		this.color = color;
	}

	toString() {
		return this.category + ':' + this.value;
	}

	toData() {
		return JSON.stringify(new TagData(this.category, this.value));
	}
}

export class TagData {
	category: string;
	value: string;

	constructor(category: string, value: string) {
		this.category = category;
		this.value = value;
	}

	toTagChoice(tags: CustomTag[]) {
		const r = tags.find((i) => i.name === this.category);
		if (!r) throw new Error('Tag not found');
		return new CustomTagChoice(this.category, this.value, r.color);
	}
}

export class CustomTag {
	name: string;
	value: string;
	color: string;

	getChoices: () => CustomChoice[] | null;

	constructor(name: string, value: string, color: string, getChoices: () => CustomChoice[] | null) {
		this.name = name;
		this.value = value;
		this.color = color;
		this.getChoices = getChoices;
	}

	hasOption() {
		const v = this.getChoices();
		if (v === null) return false;
		return v.length > 0;
	}
}

export class CustomChoice {
	name: string;
	value: string;

	constructor(name: string, value: string) {
		this.name = name;
		this.value = value;
	}
}

export const SCHEMATIC_TAG = [
	new CustomTag('author', 'author', '#00ff00', () => null),
	new CustomTag('size', 'size', 'gray', () => [
		new CustomChoice('micro (4 tiles)', 'micro'), //
		new CustomChoice('small (16 tiles)', 'small'),
		new CustomChoice('medium (64 tiles)', 'medium'),
		new CustomChoice('big (255 tiles)', 'big'),
		new CustomChoice('huge (900 tiles)', 'huge')
	]),
	new CustomTag('position', 'position', 'gray', () => [
		new CustomChoice('core', 'core'), //
		new CustomChoice('ore', 'ore'),
		new CustomChoice('liquid', 'liquid'),
		new CustomChoice('remote', 'remote'),
		new CustomChoice('mass driver', 'mass-driver'),
		new CustomChoice('any', 'any')
	]),
	new CustomTag('unit-tier', 'unit-tier', 'blue', () => [
		new CustomChoice('tier 1', 't1'), //
		new CustomChoice('tier 2', 't2'),
		new CustomChoice('tier 3', 't3'),
		new CustomChoice('tier 4', 't4'),
		new CustomChoice('tier 5', 't5')
	]),
	new CustomTag('planet', 'planet', 'green', () => [
		new CustomChoice('serpulo', 'serpulo'), //
		new CustomChoice('erekir', 'erekir'), //
		new CustomChoice('mix', 'mix') //
	]),
	new CustomTag('item', 'item', 'green', () => [
		new CustomChoice('copper', 'copper'), //
		new CustomChoice('lead', 'lead'),
		new CustomChoice('coal', 'coal'),
		new CustomChoice('scrap', 'scrap'),
		new CustomChoice('graphite', 'graphite'),
		new CustomChoice('metaglass', 'metaglass'),
		new CustomChoice('silicon', 'silicon'),
		new CustomChoice('spore pod', 'spore-pod'),
		new CustomChoice('titanium', 'titanium'),
		new CustomChoice('plastanium', 'plastanium'),
		new CustomChoice('pyratite', 'pyratite'),
		new CustomChoice('blast compound', 'blast compound'),
		new CustomChoice('thorium', 'thorium'),
		new CustomChoice('phase fabric', 'phase-fabric'),
		new CustomChoice('surge alloy', 'surge-alloy'),
		new CustomChoice('beryllium', 'beryllium'),
		new CustomChoice('tungsten', 'tungsten'),
		new CustomChoice('oxide', 'oxide'),
		new CustomChoice('carbide', 'carbide')
	]),
	new CustomTag('liquid', 'liquid', 'blue', () => [
		new CustomChoice('water', 'water'),
		new CustomChoice('slag', 'slag'),
		new CustomChoice('oil', 'oil'),
		new CustomChoice('cryofluid', 'cryofluid'),
		new CustomChoice('neoplasm', 'neoplasm'), //
		new CustomChoice('arkycite', 'arkycite'),
		new CustomChoice('ozone', 'ozone'),
		new CustomChoice('hydrogen', 'hydrogen'),
		new CustomChoice('nitrogen', 'nitrogen'),
		new CustomChoice('cyanogen', 'cyanogen')
	]),
	new CustomTag('type', 'type', 'purple', () => [
		new CustomChoice('unit', 'unit'), //
		new CustomChoice('logic', 'logic'),
		new CustomChoice('resource', 'resource'),
		new CustomChoice('j4f', 'j4f'),
		new CustomChoice('power', 'power')
	]),
	new CustomTag('game mode', 'game-mode', '#a0a000', () => [
		new CustomChoice('campaign', 'campaign'),
		new CustomChoice('pvp', 'pvp'),
		new CustomChoice('attack', 'attack'),
		new CustomChoice('sandbox', 'sandbox'), //
		new CustomChoice('hex', 'hex')
	]),
	new CustomTag('verify', 'verify', '#FFD700', () => [
		new CustomChoice('verified', 'verified'), //
		new CustomChoice('unverified', 'unverified')
	])
];

export const SCHEMATIC_SORT_CHOICE = [
	new CustomChoice('newest', 'time:1'), //
	new CustomChoice('oldest', 'time:-1'), //
	new CustomChoice('most liked', 'like:1') //
];

export const UPLOAD_SCHEMATIC_TAG = SCHEMATIC_TAG.filter((t) => !['name', 'size', 'verify'].includes(t.value));
