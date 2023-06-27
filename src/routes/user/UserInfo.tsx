export default class UserInfo {
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

	static isUser(user: UserInfo | undefined) {
		return user && user.role.includes('USER');
	}

	static isAdmin(user: UserInfo | undefined) {
		return user && user.role.includes('ADMIN');
	}
}
