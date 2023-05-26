export default class TagQuery {
	category: string;
	color: string;
	value: string;

	constructor(category: string, color: string, value: string) {
		this.category = category;
		this.color = color;
		this.value = value;
	}

	toString() {
		return this.category + ':' + this.value;
	}
}
