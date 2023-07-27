export default class Map {
	id: string;
	name: string;
	data: string;
	authorId: string;
	description: string;
	tags: Array<string>;
	like: number;
	verifyAdmin: string;

	constructor(id: string, name: string, data: string, authorId: string, description: string, tags: Array<string>, like: number, verifyAdmin: string) {
		this.id = id;
		this.name = name;
		this.data = data;
		this.authorId = authorId;
		this.description = description;
		this.tags = tags;
		this.like = like;
		this.verifyAdmin = verifyAdmin;
	}
}
