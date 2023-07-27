import React from 'react';
import ColorText from 'src/components/common/ColorText';

interface MapDescriptionProps {
	description: string;
}

export default function MapDescription(props: MapDescriptionProps) {
	if (!props.description) return <></>;

	return <ColorText text={props.description} />;
}
