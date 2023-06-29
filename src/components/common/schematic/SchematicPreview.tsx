import { ItemRequirement } from './SchematicData';

export default interface SchematicPreview {
	name: string;
	description: string;
	image: string;
	requirement: ItemRequirement[];
}
