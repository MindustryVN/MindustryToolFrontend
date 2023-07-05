import { ItemRequirement } from "./SchematicData";

export default class SchematicUploadData {
	id: string;
	name: string;
	data: string;
	authorId: string;
	description: string;
	requirement: Array<ItemRequirement>;
	tags: Array<string>;
	like: number;
	dislike: number;

	constructor(id: string, name: string, data: string, authorId: string, description: string, requirement: Array<ItemRequirement>, tags: Array<string>, like: number, dislike: number, verifyAdmin: string) {
		this.id = id;
		this.name = name;
		this.data = data;
		this.authorId = authorId;
		this.description = description;
		this.requirement = requirement;
		this.tags = tags;
		this.like = like;
		this.dislike = dislike;
	}
}

