export default class UserData {
	id: string;
	name: string;
	imageUrl: string;
	role: string[];

	constructor(id: string, name: string, imageUrl: string, role: string[]) {
		this.id = id;
		this.name = name;
		this.imageUrl = imageUrl;
		this.role = role;
	}
}

export class Users {
	static isUser(user: UserData | undefined) {
		return user && user.role.includes('USER');
	}

	static isAdmin(user: UserData | undefined) {
		return user && user.role.includes('ADMIN');
	}
}
