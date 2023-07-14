import React from 'react';
import ColorText from 'src/components/common/ColorText';
import SchematicData from 'src/components/schematic/SchematicData';

interface SchematicDescriptionProps {
	schematic: SchematicData;
}

export default function SchematicDescription(props: SchematicDescriptionProps) {
	if (!props.schematic.description) return <></>;

	return <ColorText text={props.schematic.description} />;
}
