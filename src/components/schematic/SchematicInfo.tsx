export default interface SchematicInfo {
	id: string;
	name: string;
	data: string;
	authorId: string;
	description: string;
	requirement: ItemRequirement[];
	tags: string[];
	like: number;
	dislike: number;
}

export interface ItemRequirement {
	name: string;
	color: string;
	amount: number;
}
