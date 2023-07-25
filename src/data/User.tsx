import { UserRole } from 'src/data/UserRole';

export default class User {
	id: string;
	name: string;
	imageUrl: string;
	role: UserRole[];

	constructor(id: string, name: string, imageUrl: string, role: UserRole[]) {
		this.id = id;
		this.name = name;
		this.imageUrl = imageUrl;
		this.role = role;
	}
}

export class Users {
	static isUser(user: User | undefined) {
		return user && user.role.includes('USER');
	}

	static isAdmin(user: User | undefined) {
		return user && user.role.includes('ADMIN');
	}

	static isAuthorOrAdmin(authorId: string, user: User | undefined) {
		return user && (authorId === user.id || Users.isAdmin(user))
	}
}
