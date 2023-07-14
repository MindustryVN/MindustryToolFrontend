import React from 'react';
import ColorText from 'src/components/common/ColorText';

interface SchematicDescriptionProps {
	description: string;
}

export default function SchematicDescription(props: SchematicDescriptionProps) {
	if (!props.description) return <></>;

	return <ColorText text={props.description} />;
}
