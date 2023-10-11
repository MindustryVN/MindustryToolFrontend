import { Like } from 'src/data/Like';

export default interface Map {
	id: string;
	name: string;
	data: string;
	authorId: string;
	description: string;
	tags: Array<string>;
	like: number;
	height: number;
	width: number;
	verifyAdmin: string;
	userLike: Like;
}
