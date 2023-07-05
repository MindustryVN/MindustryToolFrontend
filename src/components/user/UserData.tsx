export default class UserData {
	id: string;
	name: string;
	email: string;
	imageUrl: string;
	role: string;

	constructor(id: string, email: string, name: string, imageUrl: string, role: string) {
		this.id = id;
		this.email = email;
		this.name = name;
		this.imageUrl = imageUrl;
		this.role = role;
	}

	static isUser(user: UserData | undefined) {
		return user && user.role.includes('USER');
	}

	static isAdmin(user: UserData | undefined) {
		return user && user.role.includes('ADMIN');
	}
}
