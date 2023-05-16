class CustomTag {
	category: string;
	getValues: any;
	color: string;

	constructor(category: string, color: string, getValues: () => string[] | null) {
		this.category = category;
		this.getValues = getValues;
		this.color = color;
	}
}

const nameTag = new CustomTag('name', '#00ff00', () => null);

const tags = [nameTag, new CustomTag('size', 'gray', () => ['small', 'medium', 'big']), new CustomTag('position', 'gray', () => ['core', 'ore', 'remote'])];

export default CustomTag;
export { tags };
