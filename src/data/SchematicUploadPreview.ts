import { ItemRequirement } from './Schematic';

export default interface SchematicUploadPreview {
	name: string;
	description: string;
	image: string;
	requirement: ItemRequirement[];
}
