import { TagChoice } from '../tag/Tag';

export default interface SchematicData {
	id: string;
	name: string;
	data: string;
	authorId: string;
	description: string;
	requirement: Array<ItemRequirement>;
	tags: Array<string>;
	like: number;
	dislike: number;
	height: number;
	width: number;
}

export interface ItemRequirement {
	name: string;
	color: string;
	amount: number;
}