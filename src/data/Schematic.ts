export default class Schematic {
	id: string;
	name: string;
	data: string;
	authorId: string;
	description: string;
	requirement: Array<ItemRequirement>;
	tags: Array<string>;
	like: number;
	verifyAdmin: string;

	constructor(id: string, name: string, data: string, authorId: string, description: string, requirement: Array<ItemRequirement>, tags: Array<string>, like: number, verifyAdmin: string) {
		this.id = id;
		this.name = name;
		this.data = data;
		this.authorId = authorId;
		this.description = description;
		this.requirement = requirement;
		this.tags = tags;
		this.like = like;
		this.verifyAdmin = verifyAdmin;
	}
}

export interface ItemRequirement {
	name: string;
	color: string;
	amount: number;
}
