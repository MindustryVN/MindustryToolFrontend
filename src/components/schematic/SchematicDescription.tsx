import React from 'react';
import ColorText from 'src/components/common/ColorText';
import SchematicData from 'src/components/schematic/SchematicData';

interface SchematicDescriptionProps {
	description: string;
}

export default function SchematicDescription(props: SchematicDescriptionProps) {
	if (!props.description) return <></>;

	return <ColorText text={props.description} />;
}
