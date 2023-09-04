import React from 'react';
import ColorText from 'src/components/ColorText';

interface DescriptionProps {
	description: string;
}

export default function Description(props: DescriptionProps) {
	if (!props.description) return <></>;

	return <ColorText text={props.description} />;
}
