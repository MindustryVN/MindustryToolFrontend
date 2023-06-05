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
}

export function isAdmin(user: UserInfo | undefined): boolean {
	if (!user) return false;
	return user.role.includes('ADMIN');
}
