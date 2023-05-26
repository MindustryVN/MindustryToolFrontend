import { ItemRequirement } from './SchematicInfo';

export default interface SchematicPreview {
	name: string;
	description: string;
	image: string;
	requirement: ItemRequirement[];
}
