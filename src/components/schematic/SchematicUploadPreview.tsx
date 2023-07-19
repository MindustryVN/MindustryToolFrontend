import { ItemRequirement } from '../../data/Schematic';

export default interface SchematicUploadPreview {
	name: string;
	description: string;
	image: string;
	requirement: ItemRequirement[];
}
