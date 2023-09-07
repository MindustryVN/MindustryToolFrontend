import React from 'react';
import ColorText from 'src/components/ColorText';

interface DescriptionProps {
	description: string;
}

export default function Description({ description }: DescriptionProps) {
	if (!description) return <></>;

	return <ColorText text={description} />;
}
