class CustomTag {
	category: string;
	getValues: any;
	color: string;

	constructor(category: string, color: string, getValues: () => string[] | null) {
		this.category = category;
		this.getValues = getValues;
		this.color = color;
	}

	hasOption() {
		if (this.getValues() == null) return false;
		return this.getValues().length > 0;
	}
}

const nameTag = new CustomTag('name', '#00ff00', () => null);

export const SCHEMATIC_TAG = [
	nameTag, //
	new CustomTag('size', 'gray', () => ['small', 'medium', 'big']),
	new CustomTag('position', 'gray', () => ['core', 'ore', 'remote'])
];


export const UPLOAD_SCHEMATIC_TAG = SCHEMATIC_TAG.filter((t) => !["name", "size"].includes(t.category))

export default CustomTag;
