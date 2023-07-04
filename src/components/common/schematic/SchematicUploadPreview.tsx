import { ItemRequirement } from './SchematicData';

export default interface SchematicUploadPreview {
	name: string;
	description: string;
	image: string;
	requirement: ItemRequirement[];
}
