import './Tag.css';
import '../../styles.css';

import { capitalize } from '../util/Util';

import React, { ReactElement } from 'react';

export default class Tag extends React.Component<{ index: number; name: string; value: string; color: string; removeButton?: ReactElement }> {
	render() {
		return (
			<div className='tag flexbox-center' style={{ backgroundColor: this.props.color }}>
				<div className='flexbox-center'>
					{capitalize(this.props.name)}: {capitalize(this.props.value)}
				</div>
				{this.props.removeButton}
			</div>
		);
	}
}

export class CustomTag {
	category: string;
	getValues: () => TagChoice[] | null;
	color: string;

	constructor(category: string, color: string, getValues: () => TagChoice[] | null) {
		this.category = category;
		this.getValues = getValues;
		this.color = color;
	}

	hasOption() {
		const v = this.getValues();
		if (v === null) return false;
		return v.length > 0;
	}
}

export class TagChoice {
	name: string;
	value: string;

	constructor(name: string, value: string) {
		this.name = name;
		this.value = value;
	}
}

export const SCHEMATIC_TAG = [
	new CustomTag('name', '#00ff00', () => null),
	new CustomTag('size', 'gray', () => [
		new TagChoice('micro (4 tiles)', 'micro'), //
		new TagChoice('small (16 tiles)', 'small'),
		new TagChoice('medium (64 tiles)', 'medium'),
		new TagChoice('big (255 tiles)', 'big'),
		new TagChoice('huge (900 tiles)', 'huge')
	]),
	new CustomTag('position', 'gray', () => [
		new TagChoice('core', 'core'), //
		new TagChoice('ore', 'ore'),
		new TagChoice('liquid', 'liquid'),
		new TagChoice('remote', 'remote'),
		new TagChoice('mass driver', 'mass-driver'),
		new TagChoice('any', 'any')
	]),
	new CustomTag('unit-tier', 'blue', () => [
		new TagChoice('tier 1', 't1'), //
		new TagChoice('tier 2', 't2'),
		new TagChoice('tier 3', 't3'),
		new TagChoice('tier 4', 't4'),
		new TagChoice('tier 5', 't5')
	]),
	new CustomTag('planet', 'green', () => [
		new TagChoice('serpulo', 'serpulo'), //
		new TagChoice('erekir', 'erekir'), //
		new TagChoice('mix', 'mix') //
	]),
	new CustomTag('item', 'green', () => [
		new TagChoice('copper', 'copper'), //
		new TagChoice('lead', 'lead'),
		new TagChoice('coal', 'coal'),
		new TagChoice('scrap', 'scrap'),
		new TagChoice('graphite', 'graphite'),
		new TagChoice('metaglass', 'metaglass'),
		new TagChoice('silicon', 'silicon'),
		new TagChoice('spore pod', 'spore-pod'),
		new TagChoice('titanium', 'titanium'),
		new TagChoice('plastanium', 'plastanium'),
		new TagChoice('pyratite', 'pyratite'),
		new TagChoice('blast compound', 'blast compound'),
		new TagChoice('thorium', 'thorium'),
		new TagChoice('phase fabric', 'phase-fabric'),
		new TagChoice('surge alloy', 'surge-alloy'),
		new TagChoice('beryllium', 'beryllium'),
		new TagChoice('tungsten', 'tungsten'),
		new TagChoice('oxide', 'oxide'),
		new TagChoice('carbide', 'carbide')
	]),
	new CustomTag('liquid', 'blue', () => [
		new TagChoice('water', 'water'),
		new TagChoice('slag', 'slag'),
		new TagChoice('oil', 'oil'),
		new TagChoice('cryofluid', 'cryofluid'),
		new TagChoice('neoplasm', 'neoplasm'), //
		new TagChoice('arkycite', 'arkycite'),
		new TagChoice('ozone', 'ozone'),
		new TagChoice('hydrogen', 'hydrogen'),
		new TagChoice('nitrogen', 'nitrogen'),
		new TagChoice('cyanogen', 'cyanogen')
	]),
	new CustomTag('type', 'purple', () => [
		new TagChoice('unit', 'unit'), //
		new TagChoice('logic', 'logic'),
		new TagChoice('resource', 'resource'),
		new TagChoice('j4f', 'j4f'),
		new TagChoice('power', 'power')
	]),
	new CustomTag('game mode', '#a0a000', () => [
		new TagChoice('campaign', 'campaign'),
		new TagChoice('pvp', 'pvp'),
		new TagChoice('attack', 'attack'),
		new TagChoice('sandbox', 'sandbox'), //
		new TagChoice('hex', 'hex')
	]),
	new CustomTag('verify', '#FFD700', () => [
		new TagChoice('verified', 'verified'), //
		new TagChoice('unverified', 'unverified')
	])
];

export const SCHEMATIC_SORT_CHOICE = [
	new TagChoice('newest', 'time:1'), //
	new TagChoice('oldest', 'time:-1'), //
	new TagChoice('most liked', 'like:1') //
];

export const UPLOAD_SCHEMATIC_TAG = SCHEMATIC_TAG.filter((t) => !['name', 'size', 'verify'].includes(t.category));
